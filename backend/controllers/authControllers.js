const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const { responseReturn } = require('../utils/response');
const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/tokenCreate');
const cloudinary = require('cloudinary').v2
const formidable = require('formidable')

class authControllers{
    admin_login = async (req, res) => {
        const {email, password} = req.body

        try{
            const admin = await adminModel.findOne({email}).select('+password');

            if(admin){
                const match = await bcrypt.compare(password, admin.password); 

                if(match){
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    res.cookie('accessToken', token, {
                        httpOnly: true,
                        secure: false, // 開發時 false
                        samesite: 'lax', 
                        path:'/',
                        expires: new Date(Date.now()+7*24*60*60*1000)
                    })
                    responseReturn(res, 200, {token, message: "Login successful"})
                }else{
                    responseReturn(res, 404, {message: "Password Wrong"})
                }
            }else{
                responseReturn(res, 404, {message: "Email not found"})
            }
        } catch(err){
            console.log(err.message);
            responseReturn(res, 500, {message: err.message})
        }   

        /* res.status(200).json({message: 'Admin login successful'}); */
    } 
    
    seller_login = async (req, res) => {
        const {email, password} = req.body

        try{
            const seller = await sellerModel.findOne({email}).select('+password');

            if(seller){
                const match = await bcrypt.compare(password, seller.password); 

                if(match){
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    })

                    res.cookie('accessToken', token, {
                        httpOnly: true,
                        secure: false, // 開發時 false
                        samesite: 'lax', 
                        path:'/',
                        expires: new Date(Date.now()+7*24*60*60*1000)
                    })
                    responseReturn(res, 200, {token, message: "Login successful"})
                }else{
                    responseReturn(res, 404, {message: "Password Wrong"})
                }
            }else{
                responseReturn(res, 404, {message: "Email not found"})
            }
        } catch(err){
            console.log(err.message);
            responseReturn(res, 500, {message: err.message})
        }   

        /* res.status(200).json({message: 'Admin login successful'}); */
    } 

    seller_register = async (req, res) => {
        const {email, name, password} = req.body
        try{
            const getUser = await sellerModel.findOne({email})
            if(getUser){
                responseReturn(res, 404, {error: 'Email Already Exists'})
            }else{
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}
                })

                await sellerCustomerModel.create({
                    myId: seller.id,
                })

                const token = await createToken({
                    id: seller.id,
                    role: seller.role
                })

                res.cookie('accessToken', token, {
                    httpOnly: true,
                    secure: false, // 開發時 false
                    samesite: 'lax', 
                    path:'/',
                    expires: new Date(Date.now() + 7*24*60*60*1000)
                })

                responseReturn(res, 201, {token, message: 'Register Success'})
            }
        }catch(err){
            console.log(err.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }

        /* res.status(200).json({message: 'Admin login successful'}); */
    } 

    getUser = async (req, res) => {
        const { id, role } = req;

        try{
            if(role === 'admin'){
                const user = await adminModel.findById(id)
                responseReturn(res, 200, {userInfo: user})
            }else{
                const seller = await sellerModel.findById(id)
                responseReturn(res, 200, {userInfo: seller})
            }   
        }catch(err){
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }

    profile_info_add = async (req, res) => {
        const { id } = req;
        const { division, district, shopName, sub_district } = req.body;

        try{
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district
                }
            })
            
            const userInfo = await sellerModel.findById(id)

            responseReturn(res, 201, { userInfo, message: 'Profile Info Added Successfully' })
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    profile_image_upload = async (req, res) => {
        const {id} = req

        const form = formidable({ multiples: false })
        form.parse(req, async(err,_, files) => {
            const { image } = files
  
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })
            
            try{
                let result = await cloudinary.uploader.upload(image.filepath, {
                            folder: 'profile'})

                if(result){
                    await sellerModel.findByIdAndUpdate(id, { image: result.url })
                    const userInfo =  await sellerModel.findById(id)

                    responseReturn(res, 201, { userInfo, message: 'Profile Image Uploaded Successfully' })
                }else{
                    responseReturn(res, 404, { error: 'Image Upload Failed' })
                }
            }catch(error){
                responseReturn(res, 500, { error: error.message })
            }


















        })
        
    }

    logout = async (req, res) => {
        try{
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            })
            responseReturn(res, 200, {message: 'logout Success'})
        }catch(error){
            responseReturn(res, 500, {error: error.message})
        }
    }
}

module.exports = new authControllers()