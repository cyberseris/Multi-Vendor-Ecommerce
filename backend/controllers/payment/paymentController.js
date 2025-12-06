const sellerModel = require('../../models/sellerModel')
const stripeModel = require('../../models/stripeModel')
const sellerWalletModel = require('../../models/sellerWalletModel')
const withdrawalRequestModel = require('../../models/withdrawalRequestModel')
const { v4:uuidv4 } = require('uuid')
const { responseReturn } = require('../../utils/response')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

class paymentController{
    create_stripe_connect_account = async(req, res) => {
        const { id } = req
        const uid = uuidv4()

        try{
            const stripeInfo = await stripeModel.findOne({ sellerId: id })
            if(stripeInfo){
                await stripeModel.deleteOne({ sellerId: id })
                const account = await stripe.accounts.create({ type: 'express' })
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url:accountLink.url })
            }else{
                const account = await stripe.accounts.create({ type: 'express' })
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url:accountLink.url })
            }
        }catch(error){
            responseReturn(res, 500, {error:error.message})
        }
    }

    active_stripe_connect_account = async(req, res) => {
        const { activeCode } = req.params
        const { id } = req
        let userStripeInfo

        try{
            userStripeInfo = await stripeModel.findOne({
                code: activeCode
            })

            if(userStripeInfo){
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                })
                responseReturn(res, 200, {message: 'payment Active'})
            }else{
                responseReturn(res, 404, {message: 'payment Active Fails'})
            }
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }
    }

    sumAmount = (data) => {
        let sum = 0
        for(let i=0; i<data.length; i++){
            sum = data[i].amount
        }   
        return sum
    }

    get_seller_payment_details = async(req, res) => {
        const { sellerId } = req.params

        try{
            const payments = await sellerWalletModel.find({sellerId})
            const pendingWithdrawals = await withdrawalRequestModel.find({
                sellerId: sellerId,
                status: 'pending'
            })

            const successWithdrawals = await withdrawalRequestModel.find({
                sellerId: sellerId,
                status: 'success'
            })
                            
            const pendingAmount = this.sumAmount(pendingWithdrawals) //已申請提款，平台未處理的金額
            const withdrawalAmount = this.sumAmount(successWithdrawals) //已成功提款的金額
            const totalAmount = this.sumAmount(payments) //總收入金額
            let availableAmount = 0

            if(totalAmount>0){
                availableAmount = totalAmount -(pendingAmount + withdrawalAmount)
            }

            responseReturn(res, 200, {
                totalAmount,
                pendingAmount,
                withdrawalAmount,
                availableAmount,
                pendingWithdrawals,
                successWithdrawals
            })

        }catch(error){
            console.log("get_seller_payment_details error...", error.message); 
            responseReturn(res, 500, {message: error.message})
        }
    }

    send_withdrawal_request = async(req, res) => {
        console.log("send_withdrawal_request...");
        console.log(req.body)
        console.log("send_withdrawal_request...");
        const { amount, sellerId }  = req.body
        try{
            const withdrawalRequest = await withdrawalRequestModel.create({
                sellerId: sellerId,
                amount: parseInt(amount)
            })
            responseReturn(res, 201, {withdrawalRequest, message: 'Withdrawal request sent'})
        }catch(error){
            responseReturn(res, 500, {message: error.message})
        }
    }
}

module.exports = new paymentController()