import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utility/axios";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/product/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
