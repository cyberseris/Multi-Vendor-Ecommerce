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
        sellers: [],
        seller: '',
        totalSeller: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
       builder
            .addCase(get_seller_request.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_seller_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error;
            })
            .addCase(get_seller_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.sellers = payload.sellers;
                state.totalSeller = payload.totalSeller; 
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
            console.log("searchValue..................: ", searchValue)
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