import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { jwtDecode } from "jwt-decode";

export const admin_login = createAsyncThunk(
    'auth/admin_login', 
    async(info, {rejectWithValue, fulfillWithValue}) => {
        console.log(info);
        try{
            const { data } = await api.post('/admin-login', info, {
                withCredentials:true
            });

            localStorage.setItem('accessToken', data.token);
            
            console.log(data);
            return fulfillWithValue(data);

        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const seller_login = createAsyncThunk(
    'auth/seller_login', 
    async(info, {rejectWithValue, fulfillWithValue}) => {
        console.log(info);
        try{
            const { data } = await api.post('/seller-login', info, {
                withCredentials:true
            });

            localStorage.setItem('accessToken', data.token);
            
            console.log("seller_login: ", data);
            return fulfillWithValue(data);

        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

export const get_user_info = createAsyncThunk(
    'auth/get_user_info', 
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.get('/get-user', {
                withCredentials:true
            });
            
            return fulfillWithValue(data);
        }catch(error){
            console.log("get_user_info error:", error.response?.data); 
            return rejectWithValue(error.response?.data || {error: 'Failed to get user info'});
        }
    }   
)


export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add', 
    async(profile, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/profile-info-add', profile, {
                withCredentials:true
            });
            
            console.log("profile_info_add....................: ", data);
            return fulfillWithValue(data);
        }catch(error){
            console.log("profile_info_add error:", error.response?.data); 
            return rejectWithValue(error.response?.data || {error: 'Failed to profile_info_add'});
        }
    }   
)



export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload', 
    async(image, {rejectWithValue, fulfillWithValue}) => {
        console.log("profile_image_upload image: ", image);
        try{
            const { data } = await api.patch('/profile-image-upload', image, {
                withCredentials:true
            });
            
            console.log("profile_image_upload: ", data);
            return fulfillWithValue(data);
        }catch(error){
            console.log("profile_image_upload error:", error.response?.data); 
            return rejectWithValue(error.response?.data || {error: 'Failed to get user info'});
        }
    }   
)

export const seller_register = createAsyncThunk(
    'auth/seller_register', 
    async(info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/seller-register', info, {
                withCredentials:true
            });

            localStorage.setItem('accessToken', data.token);
            
            console.log(data);
            return fulfillWithValue(data);

        }catch(error){
            console.log(error.response.data); 
            return rejectWithValue(error.response.data);
        }
    }   
)

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

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage:'',
        errorMessage:'',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken')
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
                /* state.errorMessage = payload?.error || payload?.message || 'Login failed'; */
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(seller_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(seller_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(get_user_info.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_user_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;  // payload e.g. { userInfo: user }, 後端來的 responseReturn(res, 200, {userInfo: user})
                state.role = payload.userInfo.role;
            })
            .addCase(get_user_info.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Failed to get user info';
            })
            .addCase(profile_image_upload.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message;
            })
            .addCase(profile_info_add.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_info_add.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(profile_info_add.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.userInfo = payload.userInfo;
            });
            
    }
})

export const { messageClear } = authReducer.actions;
export default authReducer.reducer