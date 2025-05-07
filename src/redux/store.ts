import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/users/userSlice";
import productReducer from "./Slices/products/productSlice";
import cartReducer from "./Slices/cart/cartSlice";
import orderReducer from "./Slices/order/orderSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
