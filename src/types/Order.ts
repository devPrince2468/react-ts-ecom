import Product from "./Product";
import { User } from "./User";

export interface Order {
  id: string;
  user: User;
  items: Product[]; // Assuming the order items are products with quantity
  totalPrice: number;
  shippingAddress: string; // example field
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: string;
}
