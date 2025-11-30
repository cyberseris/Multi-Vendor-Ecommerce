const sellerModel = require('../../models/sellerModel')
const customerModel = require('../../models/customerModel')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const sellerCustomerMessageModel = require('../../models/chat/sellerCustomerMsgModel')
const adminSellerMessageModel = require('../../models/chat/adminSellerMessageModel')
const { responseReturn } = require("../../utils/response")

class chatController{
    add_customer_friend = async(req, res) => {
        const { sellerId, userId } = req.body

        try{
            if(sellerId !== ''){
                const seller = await sellerModel.findById(sellerId)
                const user = await customerModel.findById(userId)
                const checkSeller = await sellerCustomerModel.findOne({
                    $and: [
                        {
                            myId: {
                                $eq: userId
                            }
                        },
                        {
                            myFriends: {
                                $elemMatch: {
                                    fdId: sellerId
                                }
                            }
                        }
                    ]
                })

                if(!checkSeller){
                    await sellerCustomerModel.updateOne({
                        myId: userId
                    },
                    {
                        $push: {
                            myFriends: {
                                fdId: sellerId,
                                name: seller.shopInfo?.shopName,
                                image: seller.image
                            }
                        }
                    }
                    )
                }

                const checkCustomer = await sellerCustomerModel.findOne({
                    $and: [
                        {
                            myId: {
                                $eq: sellerId
                            }
                        },
                        {
                            myFriends: {
                                $elemMatch: {
                                    fdId: userId
                                }
                            }
                        }
                    ]
                })

                if(!checkCustomer){
                    await sellerCustomerModel.updateOne({
                        myId: sellerId
                    },
                    {
                        $push: {
                            myFriends: {
                                fdId: userId,
                                name: user.name,
                                image: ""
                            }
                        }
                    }
                    )
                }

                const messages = await sellerCustomerMessageModel.find({
                    $or: [
                        {
                            $and: [
                                {
                                    receiverId: {$eq: sellerId}
                                },
                                {
                                    senderId: {
                                        $eq: userId
                                    }
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    receiverId: {$eq: userId}
                                },
                                {
                                    senderId: {
                                        $eq: sellerId
                                    }
                                }
                            ]
                        }
                    ]
                })

                const myFriends = await sellerCustomerModel.findOne({
                    myId: userId
                })

                const currentFd = myFriends.myFriends.find(s => s.fdId === sellerId)

                responseReturn(res, 200, {
                    myFriends: myFriends.myFriends,
                    currentFd,
                    messages
                })

            }else{
                const myFriends = await sellerCustomerModel.findOne({
                    myId: userId
                })

                responseReturn(res, 200, {
                    myFriends: myFriends.myFriends
                })
            }
        }catch(error){
            responseReturn(res, 500, { error: error.message })
        }
    }

    add_customer_message = async(req, res) => {
        const { userId, name, text, sellerId } = req.body

        try{
            const message = await sellerCustomerMessageModel.create({
                senderName: name,
                senderId: userId, 
                receiverId: sellerId,
                message: text 
            })

            const data = await sellerCustomerModel.findOne({
                myId: userId
            })

            let myFriends = data.myFriends
            console.log("myFriends: ", myFriends)
            let index = myFriends.findIndex(f => f.fdId === sellerId)
            while(index > 0){
                let temp = myFriends[index]
                myFriends[index] = myFriends[index-1]
                myFriends[index-1] = temp
                index--
            }

            await sellerCustomerModel.updateOne(
                {
                    myId: userId
                },
                {
                    myFriends
                }
            )

            const data2 = await sellerCustomerModel.findOne({
                myId: sellerId
            })

            let myFriends2 = data2.myFriends
            /* console.log("myFriends2: ", myFriends2) */
            let index2 = myFriends2.findIndex(f => f.fdId === userId)

            while(index2 > 0){
                let temp2 = myFriends2[index]
                myFriends2[index2] = myFriends2[index2-1]
                myFriends2[index2-1] = temp2
                index2--
            }

            await sellerCustomerModel.updateOne(
                {
                    myId: sellerId
                },
                {
                    myFriends2
                }
            )

            responseReturn(res, 201, { message })
        }catch(error){
            responseReturn(res, 500, { error:error.message })
        }

    }

    add_seller_message = async(req, res) => {
        const { sellerId, receiverId, name, text } = req.body

        try{
            const message = await sellerCustomerMessageModel.create({
                senderName: name,
                senderId: sellerId, 
                receiverId: receiverId,
                message: text 
            })

            const data = await sellerCustomerModel.findOne({
                myId: sellerId
            })

            let myFriends = data.myFriends
            /* console.log("myFriends: ", myFriends) */
            let index = myFriends.findIndex(f => f.fdId === receiverId)
            while(index > 0){
                let temp = myFriends[index]
                myFriends[index] = myFriends[index-1]
                myFriends[index-1] = temp
                index--
            }

            await sellerCustomerModel.updateOne(
                {
                    myId: sellerId
                },
                {
                    myFriends
                }
            )

            const data2 = await sellerCustomerModel.findOne({
                myId: receiverId
            })

            let myFriends2 = data2.myFriends
            /* console.log("myFriends2: ", myFriends2) */
            let index2 = myFriends2.findIndex(f => f.fdId === sellerId)

            while(index2 > 0){
                let temp2 = myFriends2[index]
                myFriends2[index2] = myFriends2[index2-1]
                myFriends2[index2-1] = temp2
                index2--
            }

            await sellerCustomerModel.updateOne(
                {
                    myId: receiverId
                },
                {
                    myFriends2
                }
            )

            responseReturn(res, 201, { message })
        }catch(error){
            responseReturn(res, 500, { error:error.message })
        }

    }

    get_customers = async(req, res) => {
        const { sellerId } = req.params
        try{
            const data = await sellerCustomerModel.findOne({
                myId: sellerId
            })
            responseReturn(res, 200, { customers: data.myFriends })
        }catch(error){
            responseReturn(res, 500, error.message)
        }
    }

    get_sellers = async(req, res) => {
        try{
            const sellers = await sellerModel.find({})
            responseReturn(res, 200, { sellers })
        }catch(error){
            responseReturn(res, 500, error.message)
        }
    }

    get_customers_seller_message = async(req, res) => {
        const { customerId } = req.params
        const { id } = req

        try{
            const messages = await sellerCustomerMessageModel.find({
                $or: [
                    {
                        $and: [
                            {
                                senderId: { $eq:customerId }
                            },
                            {
                                receiverId: { $eq: id }
                            }
                        ]
                    },
                    {
                        $and: [
                            {
                                senderId: { $eq: id }
                            },
                            {
                                receiverId: { $eq: customerId }
                            }
                        ]
                    }
                ]
            })

            const currentCustomer = await customerModel.findById(customerId)

            responseReturn(res, 200, {
                messages,
                currentCustomer
            })
        }catch(error){
            responseReturn(res, 500, error.message)
        }

    } 

    send_message_seller_admin = async(req, res) => {
        const {senderId, receiverId, message, senderName} = req.body

        try{
            const messageData = await adminSellerMessageModel.create({
                senderId, 
                receiverId, 
                message, 
                senderName
            })
            responseReturn(res, 200, {message: messageData})
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }
    }

    get_admin_message = async(req, res) => {
        const { receiverId } = req.params
        
        try{
            const messages = await adminSellerMessageModel.find({
                $or: [
                    {
                        receiverId: {$eq:receiverId}
                    },
                    {
                        senderId: {$eq:receiverId}
                    }
                ]
            })

            let currentSeller = {}
            if(receiverId){
                currentSeller = await sellerModel.findById(receiverId)
            }

            /* 11/29
            responseReturn(res, 200, { 
                message: messages,
                currentSeller 
            }) */

            console.log("==============messages==============")
            console.log(messages)
            console.log("==============messages==============")

            responseReturn(res, 200, { 
                messages,
                currentSeller 
            })
        }catch(error){
            responseReturn(res, 500, { message: error.message })
        }
    }

    get_seller_message = async(req, res) => {
        const { id } = req
        
        try{
            const messages = await adminSellerMessageModel.find({
                $or: [
                    {
                        receiverId: {$eq:id}
                    },
                    {
                        senderId: {$eq:id}
                    }
                ]
            })

            responseReturn(res, 200, { 
                messages
            })
        }catch(error){
            responseReturn(res, 500, { message: error.message })
        }        
    }
}

module.exports = new chatController()