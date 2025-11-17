const formidable = require('formidable')
const { responseReturn } = require('../../utils/response')
const cloudinary = require('cloudinary').v2
const categoryModel = require('../../models/categoryModel')

class categoryController{
    
    add_category = async (req, res) => {
        const form = formidable()
        form.parse(req, async (err,fields,files) => {
            console.log("fields: ", fields)
            console.log("files: ", files)
            if(err){
                responseReturn(res, 404, { error: 'something went wrong'})
            }else{
                // 處理 key 名稱，有些情況下會多出 ': '
                let name = fields.name || fields['name: '] || fields['name ']
                let image = files.image || files['image: '] || files['image ']
                
                console.log("Extracted name: ", name)
                console.log("Extracted image: ", image)
                
                if(!name || !image){
                    return responseReturn(res, 400, { error: 'Name and Image are required' })
                }
                
                name = name.trim()
                const slug = name.split(' ').join('-')

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })

                try{
                    console.log("Uploading to cloudinary...")
                    console.log("Image filepath: ", image.filepath)
                    console.log("Cloudinary config: ", {
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key ? 'exists' : 'missing',
                        api_secret: process.env.api_secret ? 'exists' : 'missing'
                    })
                    
                    const result = await cloudinary.uploader.upload(image.filepath, { folder: 'categorys' }) 

                    console.log("cloudinary result: ", result)

                    if(result){
                        const category = await categoryModel.create({
                            name,
                            slug,
                            image: result.url
                        })
                        responseReturn(res, 201, { category, message: 'Category Added Successfully' })
                    }else{
                        responseReturn(res, 404, { error: 'Image Upload Failed' })
                    }

                }catch(err){
                    console.log("Error details: ", err)
                    console.log("Error message: ", err.message)
                    console.log("Error stack: ", err.stack)
                    responseReturn(res, 500, { error: 'Internal Server Error: ' + err.message })
                }
                
            }
        })
        console.log("Oh YA!")
    }

    get_category = async (req, res) => {
        console.log("Get Category called with query:", req.query)
        const { page, searchValue, perPage, perpage } = req.query
        const itemsPerPage = perPage || perpage || 5 // 支援兩種命名方式，預設 5
        /* const skipPage = parseInt(itemsPerPage) * (parseInt(page || 1) - 1) */

        console.log("Query params:", { page, searchValue, perPage, perpage })

        try{
            let skipPage = ''
            if(perPage && page){
                skipPage = parseInt(perPage) * (parseInt(page || 1) - 1)
            }

            if(searchValue && page && perPage){
                const categorys = await categoryModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parseInt(itemsPerPage)).sort({createdAt: -1}) //由新到舊

                const totalCategory = await categoryModel.find({
                    $text: {$search: searchValue}
                }).countDocuments()

                console.log("Searched Categorys: ", categorys.length, "Total:", totalCategory)
                responseReturn(res, 200, { categorys, totalCategory })
            }else if(searchValue==='' && page && perPage){
                console.log("Fetching paginated categories without search...")
                console.log("Calculated skipPage:", skipPage, "with perPage:", perPage, "and page:", page)    
                const categorys = await categoryModel.find({}).skip(skipPage).limit(parseInt(itemsPerPage)).sort({createdAt: -1}) //由新到舊
                const totalCategory = await categoryModel.find({}).countDocuments()

                console.log("===========All Categorys==========: ", categorys, categorys.length, "Total:", totalCategory)
                responseReturn(res, 200, { categorys, totalCategory })
            }else {
                const categorys = await categoryModel.find({}).sort({createdAt: -1}) 
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, { categorys, totalCategory })
            }

        }catch(err){
            console.log("Error in get_category:", err)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }
    
}

module.exports = new categoryController()