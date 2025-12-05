const { responseReturn } = require('../../utils/response');
const cartModel = require('../../models/cartModel');
const wishlistModel = require('../../models/wishlistModel');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

class cartController{
    add_to_cart = async (req, res) => {
        console.log(req.body)
        const { userId, productId, quantity } = req.body 
        try{
            const product = await cartModel.findOne({
                $and: [{
                    productId: {
                        $eq: productId
                    }
                },{
                    userId: {
                        $eq: userId
                    }
                }
            ]
            })

            if(product){
                responseReturn(res, 400, { error: 'Product already in cart' })
            }else{
                const product = await cartModel.create({
                    userId,
                    productId,
                    quantity
                })

                responseReturn(res, 200, { message: 'Added to cart successfully', product })
            }
        }catch(error){
            responseReturn(res, 500, { error: 'Server error' })
        }
    }

    add_wishlist = async (req, res) => {
        const { userId, productId, name, price, images, discount, rating, slug} = req.body;

        console.log("userId: ", typeof userId)
        console.log("productId: ", typeof productId)

        /* const { productId } = req.body; */

        try{
            const productExist = await wishlistModel.find({
                slug
            })

            console.log("productExist: ", productExist)

            if(productExist?.length){
                responseReturn(res, 400, { error: 'Product already in wishlist' })  
            }else{
                await wishlistModel.create({ 
                    userId: new ObjectId(userId), 
                    productId: new ObjectId(productId), 
                    name, 
                    price, 
                    images, 
                    discount, 
                    rating, 
                    slug
                })
                responseReturn(res, 201, { message: 'Added to wishlist successfully' })
            }

        }catch(error){
            responseReturn(res, 500, { error: 'Server error' })
        }
    
    }
    
    get_wishlist = async (req, res) => {
        const { userId } = req.params;

        try{
            const wishlist = await wishlistModel.find({
                userId: new ObjectId(userId)
            });

            responseReturn(res, 200, { 
                wishlist, 
                wishlist_count: wishlist.length 
            })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    remove_wishlist = async (req, res) => {
        const {wishlistId} = req.params;
        try{
            await wishlistModel.findByIdAndDelete(wishlistId);
            responseReturn(res, 200, { 
                message: 'Wishlist item removed successfully'
            })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_cart_products = async (req, res) => {
        const co = 5 // commition value 電商網站的佣金
        const { userId } = req.params;
        console.log("=== get_cart_products START ===")
        console.log("get_cart_products userId.....", userId)
        console.log("userId type:", typeof userId)
        
        try{
            // 驗證 userId 是否為有效的 ObjectId
            if (!ObjectId.isValid(userId)) {
                console.log("Invalid userId format!")
                return responseReturn(res, 400, { error: 'Invalid userId format' })
            }

            console.log("userId is valid, proceeding with aggregate...")

            // cart_products = { _id: XXX, userId: XXX, ..., products: [[Object]] }
            const cart_products = await cartModel.aggregate([
                {
                    $match: {
                        userId: new ObjectId(userId)  // 忽略 IDE 的刪節線警告，不影響
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'products'
                    }
                }
            ])

/*             console.log("Aggregate completed!")
            console.log("cart_products: ", cart_products)
            console.log("cart_products length: ", cart_products.length) */

            let buy_product_item = 0
            let calculatePrice = 0
            let cart_product_count = 0

            // 取出缺貨的商品
            const outOfStockProducts = cart_products.filter(p => p?.products[0]?.stock < p.quantity);

            // 計算缺貨商品數量
            for(let i = 0; i < outOfStockProducts.length; i++){
                cart_product_count = cart_product_count + outOfStockProducts[i].quantity
            }

            // 取出目前有庫存的商品
            const stockProducts = cart_products.filter(p => p?.products[0]?.stock >= p.quantity);

            // 計算有庫存商品的總價與數量
            for(let i = 0; i < stockProducts.length; i++){
                const { quantity } = stockProducts[i];
                cart_product_count = buy_product_item + quantity
                buy_product_item = buy_product_item + quantity

                const { price, discount } = stockProducts[i].products[0];

                if(discount && discount > 0){
                    calculatePrice = calculatePrice + (price - discount) * quantity
                }else{
                    calculatePrice = calculatePrice + price * quantity
                }
            }

            let p = [] // 依賣家分組的商品, [{},{},...,{}]
            // 依賣家分組
            let unique = [...new Set(stockProducts.map(p=>p.products[0].sellerId.toString()))]

            // 依賣家分組
            for(let i = 0; i < unique.length; i++){
                let price = 0;
                for(let j = 0; j < stockProducts.length; j++){
                    const tempProduct = stockProducts[j].products[0];
                    if(unique[i] === tempProduct.sellerId.toString()){
                        let pri = 0;
                        // 計算商品價格
                        if(tempProduct.discount !== 0){
                            pri = tempProduct.price - tempProduct.discount;
                        }else{
                            pri = tempProduct.price
                        }
                        // 扣除佣金
                        pri = pri - Math.floor((pri * co) / 100); // 扣除佣金
                        // 計算總價(扣除佣金後)
                        price = price + pri * stockProducts[j].quantity;
                        // j = 0 1 2 ..., 代表同一賣家的不同商品
                        p[i] = {
                            sellerId: unique[i],
                            shopName: tempProduct.shopName,
                            price,
                            // j = 0 1 2 ..., 代表同一賣家的不同商品
                            products: p[i] ? [
                                ...p[i].products,
                                {
                                    _id: stockProducts[j]._id,
                                    quantity: stockProducts[j].quantity,
                                    productInfo: tempProduct
                                }
                            ]: [{
                                    _id: stockProducts[j]._id,
                                    quantity: stockProducts[j].quantity,
                                    productInfo: tempProduct
                            }]
                        }
                    }
                }
            }
            
/*             console.log("stockProducts: ", stockProducts)
            console.log("p: ", p) */

            responseReturn(res, 200, {
                cart_products: p,
                price: calculatePrice,
                cart_product_count: cart_product_count,
                shipping_fee: 2 * p[0].products.length, // 運費計算,
                outOfStockProducts,
                buy_product_item
            })

        }catch(error){
            console.log("Error in get_cart_products:", error)
            console.log("Error message:", error.message)
            console.log("Error stack:", error.stack)
            responseReturn(res, 500, {error: error.message })
        }
    }

    delete_cart_product = async (req, res) => {
        const { cartProductId } = req.params;
        try{
            await cartModel.findByIdAndDelete(cartProductId);
            responseReturn(res, 200, { message: 'Cart product deleted successfully' })
        }catch(error){
            responseReturn(res, 500, {error: error.message })
        }
    }

    quantity_inc = async (req, res) => {
        const { cartProductId } = req.params;
        try{
            const product = await cartModel.findById(cartProductId)
            const { quantity } = product
            await cartModel.findByIdAndUpdate(cartProductId, { quantity: quantity + 1 })

            responseReturn(res, 200, { message: 'Quantity increased successfully' })
        }catch(error){
            responseReturn(res, 500, {error: error.message })
        }
    }

    quantity_dec = async (req, res) => {
        const { cartProductId } = req.params;
        try{
            const product = await cartModel.findById(cartProductId)
            const { quantity } = product
            await cartModel.findByIdAndUpdate(cartProductId, { quantity: quantity - 1 })

            responseReturn(res, 200, { message: 'Quantity decreased successfully' })
        }catch(error){
            responseReturn(res, 500, {error: error.message })
        }
    }
}

module.exports = new cartController();