import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_to_cart = createAsyncThunk(
    'cart/add_to_cart',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/home/product/add-to-cart', info);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_cart_products = createAsyncThunk(
    'cart/get_cart_products',
    async (userId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/home/product/get-cart-products/${userId}`);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export  const delete_cart_product = createAsyncThunk(
    'cart/delete_cart_product',
    async (cartProductId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.delete(`/home/product/delete-cart-product/${cartProductId}`);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export  const quantity_inc = createAsyncThunk(
    'cart/quantity_inc',
    async (cartProductId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.patch(`/home/product/quantity-inc/${cartProductId}`);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export  const quantity_dec = createAsyncThunk(
    'cart/quantity_dec',
    async (cartProductId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.patch(`/home/product/quantity-dec/${cartProductId}`);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export  const add_to_wishlist = createAsyncThunk(
    'wishlist/add_to_wishlist',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/home/product/add-to-wishlist', info);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export  const get_wishlist = createAsyncThunk(
    'wishlist/get_wishlist',
    async (userId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/home/product/get-wishlist/${userId}`);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export  const remove_wishlist = createAsyncThunk(
    'wishlist/remove_wishlist',
    async (wishlistId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.delete(`/home/product/remove-wishlist/${wishlistId}`);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export const cartReducer = createSlice({
    name: 'cart',
    initialState: {
        cart_products: [],
        cart_product_count: 0,
        wishlist_count: 0,
        wishlist: [],
        price: 0,
        errorMessage: '',
        successMessage: '',
        shipping_fee: 0,
        buy_product_item: [],
        outofstock_products: []  
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        reset_count: (state) => {
            state.cart_product_count = 0
            state.wishlist_count = 0
        }
    }, 
    extraReducers: (builder) => {
        builder
        .addCase(add_to_cart.pending, (state) => {
            state.loader = true;
        })
        .addCase(add_to_cart.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(add_to_cart.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.cart_products = payload.product;
            state.cart_product_count = state.cart_product_count+1;
            state.successMessage = payload.message;
        })
        .addCase(get_cart_products.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.cart_products = payload.cart_products;
            state.price = payload.price;
            state.cart_product_count = payload.cart_product_count;
            state.shipping_fee = payload.shipping_fee;
            state.buy_product_item = payload.buy_product_item;
            state.outofstock_products = payload.outOfStockProducts;
            state.successMessage = payload.message;
        })
        .addCase(delete_cart_product.pending, (state) => {
            state.loader = true;
        })
        .addCase(delete_cart_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(delete_cart_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(quantity_inc.pending, (state) => {
            state.loader = true;
        })
        .addCase(quantity_inc.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(quantity_inc.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(quantity_dec.pending, (state) => {
            state.loader = true;
        })
        .addCase(quantity_dec.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(quantity_dec.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(add_to_wishlist.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(add_to_wishlist.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(get_wishlist.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.wishlist = payload.wishlist;
            state.wishlist_count = payload.wishlist_count;
            state.successMessage = payload.message;
        })
        .addCase(remove_wishlist.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(remove_wishlist.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
        })

    }
})

export const { messageClear, reset_count } = cartReducer.actions; 
export default cartReducer.reducer;