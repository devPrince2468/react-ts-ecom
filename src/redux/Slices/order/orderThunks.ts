import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/axios";

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/order");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await instance.post("/order", orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
