const { responseReturn } = require('../../utils/response')
const cloudinary = require('cloudinary').v2
const myShopWalletModel = require('../../models/myShopWalletModel')
const productModel = require('../../models/productModel')
const customerOrderModel = require('../../models/customerOrderModel')
const sellerModel = require('../../models/sellerModel')
const adminSellerMessageModel = require('../../models/chat/adminSellerMessageModel')

class dashboardController{
    get_admin_dashboard_data = async(req, res) => {
        const {id} = req
        console.log("==get_admin_dashboard_data==", id)

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
}

module.exports = new dashboardController()
