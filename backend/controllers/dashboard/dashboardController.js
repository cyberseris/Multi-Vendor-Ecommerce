const { responseReturn } = require('../../utils/response')
const cloudinary = require('cloudinary').v2
const formidable = require('formidable')
const myShopWalletModel = require('../../models/myShopWalletModel')
const sellerWalletModel = require('../../models/sellerWalletModel')
const productModel = require('../../models/productModel')
const customerOrderModel = require('../../models/customerOrderModel')
const sellerOrderModel = require('../../models/sellerOrderModel')
const sellerModel = require('../../models/sellerModel')
const bannerModel = require('../../models/bannerModel')
const adminSellerMessageModel = require('../../models/chat/adminSellerMessageModel')
const sellerCustomerMsgModel = require('../../models/chat/sellerCustomerMsgModel')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;



class dashboardController{
    get_admin_dashboard_data = async(req, res) => {
        const {id} = req

        try{
            const totalSale = await myShopWalletModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: {$sum: '$amount'}
                    }
                }
            ])

            /* console.log("totalSale: ", totalSale)
            [
                { _id: null, totalAmount: 12800 }
            ] */

            const totalProduct = await productModel.find({}).countDocuments()
            const totalOrder = await customerOrderModel.find({}).countDocuments()
            const totalSeller = await sellerModel.find({}).countDocuments()
            const messages = await adminSellerMessageModel.find({}).limit(3)
            const recentOrder = await customerOrderModel.find({}).sort({createdAt: -1}).limit(5)

            responseReturn(res, 200, {
                totalProduct, 
                totalOrder, 
                totalSeller, 
                messages, 
                recentOrder,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount:0
            })
        }catch(error){
            responseReturn(res, 500, { message: error.message })
        }
    }   

    get_seller_dashboard_data = async(req, res) => {
        const {id} = req

        try{
            const totalSale = await sellerWalletModel.aggregate([
                {
                    $match: {
                        sellerId: {
                            $eq: id
                        }
                    }
                },      
                {
                    $group: {
                        _id: null,
                        totalAmount: {$sum: '$amount'}
                    }
                }
            ])

            const totalProduct = await productModel.find({
                sellerId: new ObjectId(id)
            }).countDocuments()
            const totalOrder = await sellerOrderModel.find({
                sellerId: new ObjectId(id)
            }).countDocuments()
            const totalPendingOrder = await sellerOrderModel.find({
                $and: [
                    {
                        sellerId: {
                            $eq: new ObjectId(id)
                        }
                    },
                    {
                        delivery_status: {
                            $eq: 'pending'
                        }
                    }
                ]

            }).countDocuments()

            const messages = await sellerCustomerMsgModel.find({
                $or: [
                    {
                        senderId: {
                            $eq: id
                        }
                    },
                    {
                        receiverId: {
                            $eq: id
                        }
                    }
                ]
            }).limit(3)
            const recentOrder = await sellerOrderModel.find({
                sellerId: new ObjectId(id)
            }).sort({createdAt: -1}).limit(5)

            responseReturn(res, 200, {
                totalProduct, 
                totalOrder, 
                totalPendingOrder,
                messages, 
                recentOrder,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount:0
            })
        }catch(error){
            responseReturn(res, 500, { message: error.message })
        }
    } 

    add_banner = async(req, res) => {
        const form = formidable({multiples:true})
        form.parse(req, async(err, field, files)=>{
            console.log("add_banner: ", files)
            const { productId } = field
            const { mainBanner } = files

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try{
                const { slug } = await productModel.findById(productId)
                const result = await cloudinary.uploader.upload(mainBanner.filepath, {folder:'banners'})

                const banner = await bannerModel.create({
                    productId,
                    banner: result.url,
                    link: slug
                })

                responseReturn(res, 201, {banner, message: "Banner added successfully"})
            }catch(error){
                responseReturn(res, 500, { error: error.message })
            }
        })
    }

    get_banner = async(req, res) => {
        const { productId } = req.params

        try{    
            const banner = await bannerModel.findOne({productId: new ObjectId(productId)})
            
            responseReturn(res, 200, {banner})
        }catch(error){
            /* console.log(error.message) */
            responseReturn(res, 500, {error: error.message})
        }
    }

    get_banners = async(req, res) => {
        try{    
            const banners = await bannerModel.aggregate([
                {
                    $sample: {
                        size: 5
                    }
                }
            ])
            
            responseReturn(res, 200, { banners })
        }catch(error){
            responseReturn(res, 500, {error: error.message})
        }
    }


    update_banner = async(req, res) => {
        const { bannerId } = req.params
        const form = formidable({multiples:true})

        form.parse(req, async(err,_,files) => {
            const { mainBanner } = files

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try{
                let banner = await bannerModel.findById(bannerId)
                let temp = banner.banner.split('/')
                temp = temp[temp.length-1]
                const imageName = temp.split('.')[0]
                await cloudinary.uploader.destroy(imageName)

                const { url } = await cloudinary.uploader.upload(mainBanner.filepath, {folder: 'banners'})

                await bannerModel.findByIdAndUpdate(bannerId, 
                    { banner: url},
                    { new: true }
                )

                banner = await bannerModel.findById(bannerId)
                responseReturn(res, 200, {banner, message: 'Banner updated sucessfully'})
            }catch(error){
                responseReturn(res, 500, { error: error.message})
            }
        })
    }
}

module.exports = new dashboardController()
