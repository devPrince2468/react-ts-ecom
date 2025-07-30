import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/axios";
import { CreateOrderData } from "../../../types/Order";
import { AxiosError } from "axios";

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/order");
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

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: CreateOrderData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/order", orderData);
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
