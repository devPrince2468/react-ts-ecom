import { createSlice } from "@reduxjs/toolkit";
import { getProducts } from "./productThunks";

interface ProductState {
  products: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProductState = {
  products: null,
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
