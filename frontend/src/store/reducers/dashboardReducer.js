import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_dashboard_data = createAsyncThunk(
    'dashboard/get_dashboard_data',
    async (userId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/home/customer/get-dashboard-data/${userId}`);

            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState: {
        recentOrders: [],
        errorMessage: '',
        successMessage: '',
        totalOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(get_dashboard_data.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.recentOrders = payload.recentOrders
            state.pendingOrders = payload.pendingOrders
            state.totalOrders = payload.totalOrders
            state.cancelledOrders = payload.cancelledOrders
        })     
    }
})

export const { messageClear } = dashboardReducer.actions; 
export default dashboardReducer.reducer;