import { createSlice } from "@reduxjs/toolkit";
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "./cartThunks";

interface CartState {
  items: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CartState = {
  items: null,
  loading: false,
  error: null,
  success: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.success = true;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      })

      // add product
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as string | null;
        state.success = true;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      })

      // update product
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as string | null;
        state.success = true;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      })
      // delete product
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as string | null;
        state.success = true;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      })

      // clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload as string | null;
        state.success = true;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
