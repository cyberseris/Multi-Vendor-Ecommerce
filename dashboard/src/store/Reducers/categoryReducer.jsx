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

export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage:'',
        errorMessage:'',
        loader: false,
        categories: [],
        totalCategory: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
       builder
            .addCase(categoryAdd.pending, (state) => {
                state.loader = true;
            })
            .addCase(categoryAdd.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
                /* state.errorMessage = payload?.error || payload?.message || 'Login failed'; */
            })
            .addCase(categoryAdd.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.categories = [...state.categories, payload.categorys]
            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.totalCategory = payload.totalCategory;
                state.successMessage = payload.message;
                console.log("payload.categorys: ", payload)
                state.categories = payload.categorys;
                
            })

            
    }
})

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd', 
    async({ name, image }, {rejectWithValue, fulfillWithValue}) => {
        
        try{
            const formData = new FormData();
            formData.append('name: ', name)
            formData.append('image: ', image)
            const { data } = await api.post('/category-add', formData, {
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

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer