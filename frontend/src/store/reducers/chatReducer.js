import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_friend = createAsyncThunk(
    'chat/add_friend',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/chat/customer/add-customer-friend', info);
            
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, {rejectWithValue, fulfillWithValue}) => {
        try{
            const { data } = await api.post('/chat/customer/send-message-to-seller', info);
            return fulfillWithValue(data)
        }catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        my_friends: [],
        fb_messages: [],
        currentFd:"",
        loader: false,
        errorMessage: '',
        successMessage: ''
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(add_friend.fulfilled, (state, { payload }) => {
            state.fb_messages = payload.messages
            state.currentFd = payload.currentFd  //FdId 資訊中有 seller Id
            state.my_friends = payload.myFriends
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(send_message.fulfilled, (state, { payload }) => {
            state.loader = false;
            let tempFriends = state.my_friends;
            let index = tempFriends.findIndex(f => f.fdId === payload.message.receiverId);
            while(index > 0){
                let temp = tempFriends[index];
                tempFriends[index] = tempFriends[index-1]
                tempFriends[index-1] = temp
                index--
            }

            state.my_friends = tempFriends
            state.fb_messages = [...state.fb_messages, payload.message]
            state.successMessage = 'Message Send Success'
        })


        

/*         builder
        .addCase(customer_login.pending, (state) => {
            state.loader = true;
        })
        .addCase(customer_login.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(customer_login.fulfilled, (state, { payload }) => {
            const userInfo = decodeToken(payload.token)
            state.userInfo = userInfo
            state.loader = false;
            state.successMessage = payload.message;
        })   */     
    }
})

export const { messageClear } = chatReducer.actions; 
export default chatReducer.reducer;