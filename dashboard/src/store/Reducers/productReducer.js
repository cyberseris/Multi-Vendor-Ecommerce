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

export const productReducer = createSlice({
    name: 'product',
    initialState: {
        successMessage:'',
        errorMessage:'',
        loader: false,
        products: [],
        product: '',
        totalProduct: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
       builder
            .addCase(add_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(add_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
                /* state.errorMessage = payload?.error || payload?.message || 'Login failed'; */
            })
            .addCase(add_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                /* state.products = [...state.products, payload.products] */
            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.totalProduct = payload.totalProduct;
                state.products = payload.products;
            })
            .addCase(get_product.fulfilled, (state, { payload }) => {
                state.product = payload.product;
            })
            .addCase(update_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(update_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
                /* state.errorMessage = payload?.error || payload?.message || 'Login failed'; */
            })
            .addCase(update_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.product = payload.product;
                state.successMessage = payload.message;
            })
            .addCase(product_image_update.fulfilled, (state, { payload }) => {
                state.product = payload.product;
                state.successMessage = payload.message;
            })
            
    }
})

export const add_product = createAsyncThunk(
    'product/add_product', 
    async(product, {rejectWithValue, fulfillWithValue}) => {
        
        try{
            const { data } = await api.post('/product-add', product, {
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

export const get_products = createAsyncThunk(
    'product/get_products', 
    async({ perPage, page, searchValue }, {rejectWithValue, fulfillWithValue}) => {
        try{
            console.log("searchValue..................: ", searchValue)
            const { data } = await api.get(`/products-get?page=${page}&searchValue=${searchValue}&perPage=${perPage}`, {
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

export const get_product = createAsyncThunk(
    'product/get_product', 
    async( productId, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get(`/product-get/${productId}`, {
                withCredentials:true
            });
            
            console.log("product-get: ", data);
            return fulfillWithValue(data);

        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const update_product = createAsyncThunk(
    'product/update_product', 
    async( product, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.patch('/product-update', product, {
                withCredentials:true
            });
            
            console.log("product-update: ", data);
            return fulfillWithValue(data);

        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)


export const product_image_update = createAsyncThunk(
    'product/product_image_update', 
    async( {oldImage, newImage, productId}, {rejectWithValue, fulfillWithValue}) => {
        try{
            const formData = new FormData()
            formData.append('oldImage', oldImage)
            formData.append('newImage', newImage)
            formData.append('productId', productId) 

            const { data } = await api.patch('/product-image-update', formData, {
                withCredentials:true
            });
            
            console.log("product_image_update: ", data);
            return fulfillWithValue(data);

        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)


export const { messageClear } = productReducer.actions;
export default productReducer.reducer
