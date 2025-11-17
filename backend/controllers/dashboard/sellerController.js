const sellerModel = require('../../models/sellerModel');
const { responseReturn } = require('../../utils/response');

class sellerController{
    request_seller_get = async (req, res) => {
        console.log(req.query)
        const {page, searchValue, perPage} = req.query  
        const skipPage = parseInt(perPage)*(parseInt(page)-1)

        try{
            if(searchValue){
                const sellers = await sellerModel.find({
                    $text: { $search: searchValue}
                })
            }else{
                const sellers = await sellerModel.find({ status: 'pending' }).skip(skipPage).limit(perPage).sort({createdAt: -1})
                
                const totalSeller = await sellerModel.find({}).countDocuments({
                    status: 'pending'
                })

                responseReturn(res, 200, { sellers, totalSeller })
            }
        }catch(error){
            responseReturn(res, 500, { error: error.message }) 
        }
    }

    get_seller = async (req, res) => {
        const { sellerId } = req.params

        try{
            const seller = await sellerModel.findById(sellerId)
            responseReturn(res, 200, { seller })

        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_status_update = async (req, res) => {
        const { sellerId, status } = req.body 

        try{
            await sellerModel.findByIdAndUpdate(sellerId, {status})
            const seller = await sellerModel.findById(sellerId)

            responseReturn(res, 200, { seller, message: "Seller status updated successfully" })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new sellerController()