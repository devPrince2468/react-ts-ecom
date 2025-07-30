import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/axios";
import { AxiosError } from "axios";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Something went wrong"
        );
      }
      return rejectWithValue("Something went wrong");
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
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
      }
      return rejectWithValue("Login failed");
    }
  }
);

// get User Profile
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/user/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch user profile"
        );
      }
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

// Get all users (for admin)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/user/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch users"
        );
      }
      return rejectWithValue("Failed to fetch users");
    }
  }
);
