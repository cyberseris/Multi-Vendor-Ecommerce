const { responseReturn } = require('../../utils/response');
const sellerOrderModel = require('../../models/sellerOrderModel');
const myShopWalletOrderModel = require('../../models/myShopWalletModel');
const sellerWalletModel = require('../../models/sellerWalletModel');
const customerOrderModel = require('../../models/customerOrderModel');
const cartModel = require('../../models/cartModel');
const moment = require('moment');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const stripe = require('stripe')(process.env.STRIPE_KEY)

class orderController{
    paymentCheck = async (id) => {
        try{
            const order = await customerOrderModel.findById(id)
            if(order.payment_status === 'unpaid'){
                await customerOrderModel.findByIdAndUpdate(id, { 
                    delivery_status: 'cancelled' 
                })
                await sellerOrderModel.updateMany({ 
                    orderId: id 
                }, { 
                    delivery_status: 'cancelled'  
                })
            }
            return true
        }catch(error){
            console.log("paymentCheck error: ", error)
            return false
        }
    }

    place_order = async (req, res) => {
        const { products, price, shipping_fee, shippingInfo, userId } = req.body;
        let sellerOrderData = []
        let cartId = []
        const tempData = moment(Date.now()).format('LLL')
        let customerOrderProduct = []

        // 組合 customerOrder 需要的 products 資料
        for(let i=0; i<products.length; i++){
            const pro = products[i].products
            for(let j=0; j<pro.length; j++){
                const tempCusPro = pro[j].productInfo
                console.log("tempCusPro: ", tempCusPro)
                tempCusPro.quantity = pro[j].quantity
                customerOrderProduct.push(tempCusPro)

                if(pro[j]._id){
                    cartId.push(pro[j]._id)
                }
            }
        }

        try{
            // 建立 customerOrder 訂單
            const order = await customerOrderModel.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                payment_status: 'unpaid',
                delivery_status: 'pending',
                date: tempData
            })

            // 組合 sellerOrder 需要的資料
            for(let i = 0; i < products.length; i++){
                const pro = products[i].products
                const pri = products[i].price
                const sellerId = products[i].sellerId
                const storePro = []

                for(let j=0; j<pro.length; j++){
                    const temppro = pro[j].productInfo
                    temppro.quantity = pro[j].quantity
                    storePro.push(temppro)
                }

                sellerOrderData.push({
                    orderId: order.id,
                    sellerId,
                    products: storePro,
                    price: pri,
                    payment_status: 'unpaid',
                    shippingInfo: 'Easy Main Warehourse',
                    delivery_status: 'pending',
                    date: tempData
                })
            }

            // 建立 sellerOrder 訂單
            await sellerOrderModel.insertMany(sellerOrderData);
            for(let k=0; k<cartId.length; k++){
                await cartModel.findByIdAndDelete(cartId[k])
            }

            setTimeout(() => {
                this.paymentCheck(order.id)
            }, 15000);

            
            responseReturn(res, 201, { message: 'Order Placed Successfully', orderId: order.id })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_orders = async (req, res) => {
        console.log(req.params)
        const { customerId, status } = req.params;

        try{
            let orders = []
            if(status !== 'all'){
                orders = await customerOrderModel.find({
                    customerId: new ObjectId(customerId),
                    delivery_status: status
                })
            }else{
                orders = await customerOrderModel.find({
                    customerId: new ObjectId(customerId)
                })
            }
            responseReturn(res, 200, { orders })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_admin_orders = async (req, res) => {
        console.log("req.query: ", req.query)
        let { page, perPage, searchValue } = req.query;
        page = parseInt(page)
        perPage = parseInt(perPage)
        const skipPage = perPage * (page - 1)

        try{
            let orders = []
            let totalOrders = 0
            if(searchValue){
                orders = await customerOrderModel.aggregate([
                    {
                        $text: searchValue,
                        $lookup: {
                            from: 'sellerorders',
                            localField: '_id',  //customerorders id 
                            foreignField: 'orderId',    //sellerorders order 
                            as: 'suborder'
                        }
                    }
                ]).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalOrders = await customerOrderModel.aggregate([
                    {
                        $text: searchValue,
                        $lookup: {
                            from: 'sellerorders',
                            localField: '_id',  //customerorders id 
                            foreignField: 'orderId',    //sellerorders order 
                            as: 'suborder'
                        }
                    }
                ])
            }else{
                orders = await customerOrderModel.aggregate([
                    {
                        $lookup: {
                            from: 'sellerorders',
                            localField: '_id',  //customerorders id 
                            foreignField: 'orderId',    //sellerorders order 
                            as: 'suborder'
                        }
                    }
                ]).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalOrders = await customerOrderModel.aggregate([
                    {
                        $lookup: {
                            from: 'sellerorders',
                            localField: '_id',  //customerorders id 
                            foreignField: 'orderId',    //sellerorders order 
                            as: 'suborder'
                        }
                    }
                ])
            }

            responseReturn(res, 200, { orders, totalOrders: totalOrders.length })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_admin_order = async (req, res) => {
        const { orderId } = req.params
                
        try{
            const order = await customerOrderModel.aggregate([
                {
                    $match: {_id: new ObjectId(orderId)},
                },
                {
                    $lookup: {
                        from: 'sellerorders',
                        localField: '_id',  //customerorders id 
                        foreignField: 'orderId',    //sellerorders order 
                        as: 'suborder'
                    }
                }]
            )

            console.log("order: ", order)

            responseReturn(res, 200, { order: order[0] })
        }catch(error){
            console.log(error)
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_order_details = async (req, res) => {
        const { orderId } = req.params;
        try{
            const order = await customerOrderModel.findById(orderId)
            responseReturn(res, 200, { order })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    admin_order_status_update = async (req, res) => {
        const { orderId } = req.params
        const { status } = req.body

        try{
            await customerOrderModel.findByIdAndUpdate(
                orderId,
                {delivary_status: status}
            )
            responseReturn(res, 200, {message: 'Order status updated successfully'})
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }

    }

    get_seller_orders = async (req, res) => {
        const { sellerId } = req.params
        let { page, perPage, searchValue } = req.query
        console.log(sellerId, page, perPage, searchValue)

        page = parseInt(page)
        perPage = parseInt(perPage)
        const skipPage = (page-1) * perPage
        let orders = []
        let totalOrders = 0

        try{
            if(searchValue){
                orders = await sellerOrderModel.find(
                {
                    $text: { $search: searchValue },
                    sellerId
                }
            ).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalOrders = await sellerOrderModel.find(
                    {
                        $text: { $search: searchValue },
                        sellerId
                    }
                ).countDocuments()
            }else{
                orders = await sellerOrderModel.find({sellerId}).skip(skipPage).limit(perPage).sort({createdAt: -1})
                totalOrders = await sellerOrderModel.find({sellerId}).countDocuments()
            }
            responseReturn(res, 200, { orders, totalOrders })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_seller_order = async (req, res) => {
        const { orderId } = req.params

        let order = {orderId}
        try{
            order = await sellerOrderModel.findById(orderId)
            responseReturn(res, 200, { order })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_customer_dashboard_data = async (req, res) => {
        const { userId } = req.params;

        try{
            const recentOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId)
            }).limit(5)

            const pendingOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId),
                delivery_status: 'pending'
            }).countDocuments()

            const totalOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId)
            }).countDocuments()

            const cancelledOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId),
                delivery_status: 'cancelled'
            }).countDocuments()

            responseReturn(res, 200, {
                recentOrders,
                pendingOrders,
                totalOrders,
                cancelledOrders
            })

        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_order_status_update = async (req, res) => {
        const { orderId } = req.params
        const { status } = req.body

        try{
            await sellerOrderModel.findByIdAndUpdate(
                orderId,
                {delivery_status: status}
            )
            responseReturn(res, 200, {message: 'Order status updated successfully'})
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }
    }

    create_payment = async (req, res) => {
        const { price } = req.body
        try{
            // 測試卡號 4242 4242 4242 4242
            const payment = await stripe.paymentIntents.create({
                amount: price,
                currency: 'jpy',    // Stripe 沒有台灣選項, 創建帳戶用日本
                automatic_payment_methods: {
                    enabled: true
                }
            })

            //目前 Stripe 餘額為 0, 開這個先灌可用餘額，灌可用餘額測試卡號用測試 4000 0037 2000 0278
            /* const payment = await stripe.paymentIntents.create({
                amount: price,                    // JPY 金額（單位：円）
                currency: 'jpy',
                payment_method: 'pm_card_bypassPendingInternational', // 避免錢變成 pending 款項，不能動用
                payment_method_types: ['card'],   // 只用卡
                confirm: true                     // 直接扣款
            }); */

            responseReturn(res, 201, { clientSecret: payment.client_secret })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    order_confirm = async (req, res) => {
        const { orderId } = req.params
        console.log("order_confirm orderId: ", orderId)
        try{
            await customerOrderModel.findByIdAndUpdate(orderId, {
                payment_status: 'paid'
            })

            console.log("updating seller orders...")
            await sellerOrderModel.updateMany(
                {
                    orderId: new ObjectId(orderId)
                },
                {
                    payment_status: 'paid',
                    delivery_status: 'pending'
                }
            )

            console.log("updating wallet orders...")
            const customerOrder = await customerOrderModel.findById(orderId)
            console.log("customerOrder after update: ", customerOrder)
            const sellerOrder = await sellerOrderModel.find({ orderId: new ObjectId(orderId) })
            console.log("sellerOrder after update: ", sellerOrder)
            const time = moment(Date.now()).format('l')
            const splitTime = time.split('/')  // month/day/year

            console.log("Creating customer wallet order...")
            await myShopWalletOrderModel.create({
                amount: customerOrder.price,
                month: splitTime[0],
                year: splitTime[2]
            })

            console.log("Creating seller wallet orders...")
            for(let i=0; i<sellerOrder.length; i++){
                await sellerWalletModel.create({
                    sellerId: sellerOrder[i].sellerId.toString(),
                    amount: sellerOrder[i].price,
                    month: splitTime[0],
                    year: splitTime[2]
                })
            }

            responseReturn(res, 200, { message: 'Order payment confirmed successfully' })
        }catch(error){
            console.log("order_confirm error: ", error)
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new orderController();