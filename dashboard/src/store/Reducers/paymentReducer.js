import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const get_seller_payment_details = createAsyncThunk(
    'payment/get_seller_payment_details', 
    async( sellerId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/payment/get-seller-payment-details/${sellerId}`, {
                withCredentials:true
            });
            
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const send_withdrawal_request = createAsyncThunk(
    'payment/send_withdrawal_request', 
    async( info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/payment/send-withdrawal-request', info, {
                withCredentials:true
            });
            
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_payment_request = createAsyncThunk(
    'payment/get_payment_request', 
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get('/payment/get-payment-request', {
                withCredentials:true
            });
            
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const confirm_payment_request = createAsyncThunk(
    'payment/confirm_payment_request', 
    async(paymentId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/payment/confirm-payment-request', {paymentId}, {
                withCredentials:true
            });
            
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const paymentReducer = createSlice({
    name: 'payment',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        pendingWithdrawals: [],
        successWithdrawals: [],
        totalAmount: 0,        // seller 累積收入（平台總應付給 seller 的金額）
        withdrawalAmount: 0,   // seller 已成功提款的金額（已匯款完成）
        availableAmount: 0,    // 順序 1 目前可提領的金額（帳上可用餘額, 按某一筆提款後) 
        pendingAmount: 0       // 順序 2 已提出提款，但平台尚未審核/尚未匯出的金額(審核中, 某一筆提款 pending)    
        
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
       builder
            .addCase(get_seller_payment_details.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.totalAmount = payload.totalAmount;
                state.pendingAmount = payload.pendingAmount;
                state.withdrawalAmount = payload.withdrawalAmount;
                state.availableAmount = payload.availableAmount;
                state.pendingWithdrawals = payload.pendingWithdrawals;
                state.successWithdrawals = payload.successWithdrawals;
            }) 
            .addCase(send_withdrawal_request.pending, (state) => {
                state.loader = true;
            })
            .addCase(send_withdrawal_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(send_withdrawal_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.pendingWithdrawals = [...state.pendingWithdrawals, payload.withdrawalRequest];
                state.availableAmount -= payload.withdrawalRequest.amount;
                state.pendingAmount += payload.withdrawalRequest.amount;
            })
            .addCase(get_payment_request.fulfilled, (state, { payload }) => {
                state.pendingWithdrawals = payload.withdrawalRequest
            })
            .addCase(confirm_payment_request.fulfilled, (state, { payload }) => {
                const temp = state.pendingWithdrawals.filter(pw=>pw._id!==payload.payment._id)
                state.pendingWithdrawals = temp
                state.loader = false;
                state.successMessage = payload.message;
            })
    }
})

export const { messageClear } = paymentReducer.actions;
export default paymentReducer.reducer