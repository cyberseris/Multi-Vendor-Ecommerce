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

    get_active_sellers = async (req, res) => {
        let { page, perPage, searchValue } = req.query
        page = parseInt(page)
        perPage = parseInt(perPage)

        const skipPage = perPage * (page - 1)
        let active_sellers = []
        let totalSeller = 0
        try{
            if(searchValue){
                active_sellers = await sellerModel.find({
                    $text: {$search: searchValue},
                    status: 'active'
                }).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalSeller = await sellerModel.find({
                    $text: {$search: searchValue},
                    status: 'active'
                }).countDocuments()
                responseReturn(res, 200, { totalSeller, active_sellers })
            }else{
                active_sellers = await sellerModel.find({
                    status: 'active'
                }).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalSeller = await sellerModel.find({
                    status: 'active'
                }).countDocuments()
                responseReturn(res, 200, { totalSeller, active_sellers })
            }
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }
    }

    get_deactive_sellers = async (req, res) => {
        let { page, perPage, searchValue } = req.query
        page = parseInt(page)
        perPage = parseInt(perPage)

        const skipPage = perPage * (page - 1)
        let deactive_sellers = []
        let totalSeller = 0
        try{
            if(searchValue){
                deactive_sellers = await sellerModel.find({
                    $text: {$search: searchValue},
                    status: 'deactive'
                }).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalSeller = await sellerModel.find({
                    $text: {$search: searchValue},
                    status: 'deactive'
                }).countDocuments()
                responseReturn(res, 200, { totalSeller, deactive_sellers })
            }else{
                deactive_sellers = await sellerModel.find({
                    status: 'deactive'
                }).skip(skipPage).limit(perPage).sort({createdAt: -1})

                totalSeller = await sellerModel.find({
                    status: 'deactive'
                }).countDocuments()
                responseReturn(res, 200, { totalSeller, deactive_sellers })
            }
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }
    }
    
}

module.exports = new sellerController()