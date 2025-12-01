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

export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        totalOrder: 0,
        order: {},
        myOrders: [],
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
    }
})

export const { messageClear } = orderReducer.actions
export default orderReducer.reducer