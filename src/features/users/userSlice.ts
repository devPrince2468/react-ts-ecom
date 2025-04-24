import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "./userThunks";

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
        state.success = false;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
