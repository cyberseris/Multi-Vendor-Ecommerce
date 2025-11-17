const categoryModel = require('../../models/categoryModel')
const productModel = require('../../models/productModel')
const reviewModel = require('../../models/reviewModel')
const { responseReturn } = require('../../utils/response')
const queryProducts = require('../../utils/queryProducts')
const moment = require('moment')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

class homeControllers{
    formateProducts = (products) => {
        /* console.log("Formatting products...", products) */
        const productArray = []
        let i = 0
        while(i<products.length){
            let temp = []
            let j = i
            while(j<i+3){
                if(products[j]){
                    temp.push(products[j])
                }
                j++
            }
            productArray.push([...temp])
            i=j
        }

        /* console.log("productArray: ", productArray) */
        return productArray
    }

    get_categorys = async (req, res) => {
        try{
            const categorys = await categoryModel.find({})

            /* console.log("Fetched categorys: ", categorys.length) */
            responseReturn(res, 200, { categorys })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_products = async (req, res) => {
        try{
            const products = await productModel.find({}).limit(12).sort({createdAt: -1})

            const allProduct1 = await productModel.find({}).limit(9).sort({createdAt: -1})
            const latest_product = this.formateProducts(allProduct1)

            const allProduct2 = await productModel.find({}).limit(9).sort({rating: -1})
            const topRated_product = this.formateProducts(allProduct2)

            const allProduct3 = await productModel.find({}).limit(9).sort({discount: -1})
            const discount_product = this.formateProducts(allProduct3)

            /* console.log("Fetched products: ", products.length) */
            responseReturn(res, 200, { products, latest_product, topRated_product, discount_product })
        }catch(error){
            /* console.log("Error in get_products:", error.message) */
            responseReturn(res, 500, { error: error.message })
        }
    }

    price_range_product = async (req, res) => {
        try{
            const priceRange = {
                low: 0,
                high: 0
            }
            const products = await productModel.find({}).limit(9).sort({
                createdAt: -1
            })
            const latest_product = this.formateProducts(products)
            
            const getForPrice = await productModel.find({}).sort({
                'price': 1
            })

            if(getForPrice.length>0){
                priceRange.high = getForPrice[getForPrice.length-1].price 
                priceRange.low = getForPrice[0].price 
            }

            responseReturn(res, 200, { latest_product, priceRange })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    query_products = async (req, res) => {
        const perPage = req.query.perPage ? parseInt(req.query.perPage) : 12

        try{
            const products = await productModel.find({}).sort({createdAt: -1})
            const totalProducts = new queryProducts(products, req.query).
            categoryQuery().
            ratingQuery().
            searchQuery().
            priceQuery().
            sortByPrice().
            countProducts();

            const result = new queryProducts(products, req.query).
            categoryQuery().
            ratingQuery().
            priceQuery().
            searchQuery().
            sortByPrice().
            skip().
            limit().
            getProducts();
            
            responseReturn(res, 200, { 
                products: result, 
                totalProducts, 
                perPage
            })

        }catch(error){
            console.log("Error in query_products:", error.message)
            responseReturn(res, 500, { error: error.message })
        }
    
    }

    product_details = async (req, res) => {
        const { slug } = req.params

        try{
            const product = await productModel.findOne({ slug })

            if(!product){
                return responseReturn(res, 404, { message: "Product not found!" })
            } 

            const relatedProducts = await productModel.find({
                $and: [
                    {
                    _id: {
                        $ne: product._id
                    }
                },
                {
                    category: {
                        $eq: product.category
                    }
                }
            ]
            }).limit(12)

            const moreProducts = await productModel.find({
                $and: [
                    {
                        _id: {
                            $ne: product._id
                        }
                    },
                    {
                        sellerId: {
                            $eq: product.sellerId
                        }
                    }
                ]
            }).limit(3)
            
            responseReturn(res, 200, { product, relatedProducts, moreProducts })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    submit_review = async (req, res) => {
        const { name, review, rating, productId } = req.body
        try{
            // 不能重複提交評論的功能暫時不做
            await reviewModel.create({
                productId: new ObjectId(productId),
                name,
                review,
                rating,
                date: moment(Date.now()).format('LL')
            })

            let rat = 0
            const reviews = await reviewModel.find({
                productId: new ObjectId(productId)
            })
            for(let i=0; i<reviews.length; i++){
                rat = rat + reviews[i].rating;
            }
            
            let productRating = 0
            if(reviews.length!==0){
               productRating = (rat/reviews.length).toFixed(1)
            }

            await productModel.findByIdAndUpdate(productId, {rating: productRating})
            responseReturn(res, 200, { message: "Review submitted successfully!", productRating})
            
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_reviews = async (req, res) => {
        const { productId } = req.params
        let { pageNo } = req.query

        pageNo = parseInt(pageNo)
        const limit = 5
        const skipPage = limit * (pageNo - 1)


        try{
            let getRating = await reviewModel.aggregate([{
                $match: {
                    productId: {
                        $eq: new ObjectId(productId)
                    },
                    rating: {
                       $not: {
                            $size: 0
                       } 
                    }
                }
            },
            {
                $unwind: "$rating"
            },
            {
                $group: {
                    _id: "$rating",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        let rating_review = [
            {
                rating: 5,
                sum: 0
            },
            {
                rating: 4,
                sum: 0
            },
            {
                rating: 3,
                sum: 0
            },
            {
                rating: 2,
                sum: 0
            },
            {
                rating: 1,
                sum: 0
            }
        ]

        for(let i = 0; i < rating_review.length; i++){
            for(let j = 0; j < getRating.length; j++){
                if(rating_review[i].rating === getRating[j]._id){
                    rating_review[i].sum = getRating[j].count
                    break
                }
            }
        }

        const getAll = await reviewModel.find({
            productId: new ObjectId(productId)
        })

        const reviews = await reviewModel.find({
            productId: new ObjectId(productId)
        }).skip(skipPage).limit(limit).sort({createdAt: -1})

        responseReturn(res, 200, { 
            reviews: getAll, 
            totalReview: getAll.length,
            rating_review
        })    

        
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }

        

    }
}

module.exports = new homeControllers()