import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
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
            })
            .addCase(categoryAdd.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.categories = [...state.categories, payload.categories]
            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.totalCategory = payload.totalCategory;
                state.successMessage = payload.message;
                state.categories = payload.categories;
                
            })
            .addCase(updateCategory.pending, (state) => {
                state.loader = true;
            })
            .addCase(updateCategory.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(updateCategory.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                const index = state.categories.findIndex((cat)=>cat._id === payload.category._id)
                if(index !== -1){
                    state.categories[index] = payload.category
                }
            }) 
            .addCase(deleteCategory.pending, (state) => {
                state.loader = true;
            })
            .addCase(deleteCategory.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(deleteCategory.fulfilled, (state, action ) => {
                state.loader = false;
                state.successMessage = action.payload.message;
                state.categories = state.categories.filter(cat => cat._id !== action.meta.arg)
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

export const updateCategory = createAsyncThunk(
    'category/updateCategory', 
    async({ id, name, image }, {rejectWithValue, fulfillWithValue}) => {
        try{
            const formData = new FormData();
            formData.append('name: ', name)
            if(image){
                formData.append('image: ', image)
            }            
            const { data } = await api.put(`/category-update/${id}`, formData, {
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

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory', 
    async(id, {rejectWithValue, fulfillWithValue}) => {
        try{           
            const { data } = await api.delete(`/category-delete/${id}`, {
                withCredentials:true
            });

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