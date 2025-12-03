import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { jwtDecode } from "jwt-decode";

const returnRole = (token) => {
    if(token){
        const decodeToken = jwtDecode(token)
        const expireTime = new Date(decodeToken.exp * 1000)

        if(new Date() > expireTime){
            localStorage.removeItem('accessToken')
            return ''
        }else{
            return decodeToken.role
        }

        console.log(jwtDecode(decodeToken))
    }else{

    }
}

export const sellerReducer = createSlice({
    name: 'seller',
    initialState: {
        successMessage:'',
        errorMessage:'',
        loader: false,
        active_sellers: [],
        request_sellers: [],
        deactive_sellers: [],
        seller: '',
        totalSeller: 0,
        total_request_seller:0,
        total_deactive_seller:0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
       builder
            .addCase(get_seller_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.request_sellers = payload.sellers;
                state.total_request_seller = payload.totalSeller; 
            })
            .addCase(get_seller.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.seller = payload.seller;
            })
            .addCase(seller_status_update.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.seller = payload.seller;
                state.successMessage = payload.message;
            })
            .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
                state.totalSeller = payload.totalSeller;
                state.active_sellers = payload.active_sellers;
            })
            .addCase(get_deactive_sellers.fulfilled, (state, { payload }) => {
                state.total_deactive_seller = payload.totalSeller;
                state.deactive_sellers = payload.deactive_sellers;
            })
            .addCase(active_stripe_connect_account.pending, (state) => {
                state.loader = true;
            })
            .addCase(active_stripe_connect_account.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(active_stripe_connect_account.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
    }
})

export const get_category = createAsyncThunk(
    'category/get_category', 
    async({ perPage, page, searchValue }, {rejectWithValue, fulfillWithValue}) => {
        try{
            console.log("searchValue..................: ", searchValue)
            const { data } = await api.get(`/category-get?page=${page}&searchValue=${searchValue}&perPage=${perPage}`, {
                withCredentials:true
            });
            
            console.log(data);
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_seller_request = createAsyncThunk(
    'seller/get_seller_request', 
    async({ perPage, page, searchValue }, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/request-seller-get?page=${page}&searchValue=${searchValue}&perPage=${perPage}`, {
                withCredentials:true
            });
            
            console.log(data);
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_active_sellers = createAsyncThunk(
    'seller/get_active_sellers', 
    async({ perPage, page, searchValue }, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/get-active-sellers?page=${page}&perPage=${perPage}&searchValue=${searchValue}`, {
                withCredentials:true
            });  
            console.log(data);
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_deactive_sellers = createAsyncThunk(
    'seller/get_deactive_sellers', 
    async({ perPage, page, searchValue }, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/get-deactive-sellers?page=${page}&perPage=${perPage}&searchValue=${searchValue}`, {
                withCredentials:true
            });  
            console.log(data);
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const create_stripe_connect_account = createAsyncThunk(
    'seller/create_stripe_connect_account', 
    async() => {
        try{
            const { data: { url } } = await api.get(`/payment/create-stripe-connect-account`, {
                withCredentials:true
            });  
            window.location.href = url
        }catch(error){
            console.log(error.message)
        }
    }   
)

export const active_stripe_connect_account = createAsyncThunk(
    'seller/active_stripe_connect_account', 
    async(activeCode, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.put(`/payment/active-stripe-connect-account/${activeCode}`, {}, {
                withCredentials:true
            });  
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.message)
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_seller = createAsyncThunk(
    'seller/get_seller', 
    async(sellerId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/get-seller/${sellerId}`, {
                withCredentials:true
            });
            
            console.log(data);
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const seller_status_update = createAsyncThunk(
    'seller/seller_status_update', 
    async(info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.patch('/seller-status-update', info , {
                withCredentials:true
            });
            
            console.log(data);
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer