import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/axios";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post("/user/login", credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
