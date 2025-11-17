import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";

// 建立 Redux store，使用預設 middleware，但不要檢查資料是否可序列化。
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    },
    devTools: true
});

export default store;