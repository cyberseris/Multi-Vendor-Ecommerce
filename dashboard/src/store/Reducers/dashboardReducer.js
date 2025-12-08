import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data', 
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get('/get-admin-dashboard-data', {
                withCredentials:true
            });
            
            return fulfillWithValue(data);
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }   
)

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState: {
        successMessage:'',
        errorMessage:'',
        loader: false,
        totalSale: 0,
        totalOrder: 0,
        totalProduct: 0,
        totalPendingOrder: 0,
        totalSeller: 0,
        recentOrder: [],
        recentMessage: []
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
                state.totalProduct = payload.totalProduct;
                state.totalOrder = payload.totalOrder;
                state.totalSeller = payload.totalSeller;
                state.recentMessage = payload.messages;
                state.recentOrder = payload.recentOrder;
                state.totalSale = payload.totalSale;
                console.log("payload.messages: ", payload.messages)
            })
    }
})


export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer