// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./services/apiSlice";

// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";
import productReducer from "./features/products/productSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    // add other modules here (orders, products...)
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
