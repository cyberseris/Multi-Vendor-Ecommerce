import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const get_admin_orders = createAsyncThunk(
    'order/get_admin_orders', 
    async({ perPage, page, searchValue }, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/admin/orders?page=${page}&perPage=${perPage}&searchValue=${searchValue}`, {
                withCredentials:true
            });
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_admin_order = createAsyncThunk(
    'order/get_admin_order', 
    async(orderId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/admin/orders/${orderId}`, {
                withCredentials:true
            });
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const admin_order_status_update = createAsyncThunk(
    'order/admin_order_status_update', 
    async({orderId, info}, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.put(`/admin/order-status/update/${orderId}`, info, {
                withCredentials:true
            });
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const seller_order_status_update = createAsyncThunk(
    'order/seller_order_status_update', 
    async({orderId, info}, {rejectWithValue, fulfillWithValue}) => {
        console.log("orderId, info: ", orderId, info)
        try{
            const { data } = await api.put(`/seller/order-status/update/${orderId}`, info, {
                withCredentials:true,
                headers: {
                'Content-Type': 'application/json'
                }
            });
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_seller_orders = createAsyncThunk(
    'order/get_seller_orders', 
    async({ perPage, page, searchValue, sellerId }, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/seller/orders/${sellerId}?page=${page}&perPage=${perPage}&searchValue=${searchValue}`, {
                withCredentials:true
            });
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_seller_order = createAsyncThunk(
    'order/get_seller_order', 
    async(orderId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/seller/order/${orderId}`, {
                withCredentials:true
            });
            return fulfillWithValue(data);
        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        totalOrder: 0,
        order: {},
        sellerOrder: {},
        myOrders: [],
        sellerOrders: [],
        totalSellerOrder: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
                state.myOrders = payload.orders;
                state.totalOrder = payload.totalOrders; 
            })
            .addCase(get_admin_order.fulfilled, (state, { payload }) => {
                state.order = payload.order;
            })
            .addCase(admin_order_status_update.rejected, (state, { payload }) => {
                state.errorMessage = payload.message;
            })
            .addCase(admin_order_status_update.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })  
            .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
                state.sellerOrders = payload.orders;
                state.totalSellerOrder = payload.totalOrders
            })
            .addCase(get_seller_order.fulfilled, (state, { payload }) => {
                state.sellerOrder = payload.order;
            })
            .addCase(seller_order_status_update.rejected, (state, { payload }) => {
                state.errorMessage = payload.message;
            })
            .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
            })   
    }
})

export const { messageClear } = orderReducer.actions
export default orderReducer.reducer