const sellerModel = require('../../models/sellerModel')
const customerModel = require('../../models/customerModel')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const sellerCustomerMessageModel = require('../../models/chat/sellerCustomerMsgModel')
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
        console.log(req.body)
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
            console.log("myFriends2: ", myFriends2)
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
}

module.exports = new chatController()