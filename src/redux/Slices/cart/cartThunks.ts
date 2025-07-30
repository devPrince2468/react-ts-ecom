import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/axios";
import { AddCartItemData, UpdateCartItemData } from "../../../types/Cart";
import { AxiosError } from "axios";

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/cart");
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

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (data: AddCartItemData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/cart", data);
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

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { id, data }: { id: string; data: UpdateCartItemData },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.put(`/cart/${id}`, data);
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

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/cart/${id}`);
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

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.post("/cart/clearCart");
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
