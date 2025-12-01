import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import chatReducer from "./Reducers/chatReducer";
import orderReducer from "./Reducers/orderReducer";

const rootReducers = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    chat: chatReducer,
    order: orderReducer
};

export default rootReducers