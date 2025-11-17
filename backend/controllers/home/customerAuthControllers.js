const customerModel = require('../../models/customerModel');
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel');
const { responseReturn } = require('../../utils/response');
const { createToken } = require('../../utils/tokenCreate');
const bcrypt = require('bcrypt');

class customerAuthControllers{
    customer_register = async (req,res) => {
        const { name, email, password } = req.body
        console.log("customer_register: ", req.body)

        try{
            const customer = await customerModel.findOne({ email })

            if(customer){
                responseReturn(res, 400, {error: 'Email already registered'})
            }else{
                const createCustomer = await customerModel.create({ 
                    name: name.trim(), 
                    email: email.trim(), 
                    password: await bcrypt.hash(password, 10),
                    method: 'manually' 
                })

                await sellerCustomerModel.create({
                    myId: createCustomer.id
                })

                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method
                })

                /* const token = await createToken({
                    id: createCustomer.id,
                    role: 'customer'
                }) */

                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7*24*60*60*1000)
                })

                responseReturn(res, 201, { message: 'Registered Successfully', token })
            }

        }catch(error){
            console.log("customer_register error: ", error)
            responseReturn(res, 500, { error: error.message })
        }
    }

    customer_login = async (req, res) => {
        /* console.log(req.body) */
        const { email, password } = req.body
        try{
            // + 強制包含密碼欄位
            const customer = await customerModel.findOne({email}).select('+password')
            if(customer){
                const match = await bcrypt.compare(password, customer.password)
                if(match){
                    const token = await createToken({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7*24*60*60*1000)
                    })

                    responseReturn(res, 200, { message: 'Login Successful', token })
                }else{
                    responseReturn(res, 400, { error: 'Password is incorrect' })
                }
            }else{
                responseReturn(res, 404, { error: 'Email not found' })
            }

        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new customerAuthControllers()