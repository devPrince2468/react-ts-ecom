"use client";

import type React from "react";
import { useEffect, useState } from "react";
import "./Profile.scss";
import { toast } from "react-toastify";
import { getUserProfile } from "../../../redux/Slices/users/userThunks";
import { store } from "../../../redux/store";
import { useDispatch } from "react-redux";

interface Product {
  title: string;
  price: string;
  image: string;
}

interface OrderItem {
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  orders: Order[];
}

const Profile: React.FC = () => {
  const { loading, error } = store.getState().users;
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const dispatch = useDispatch<typeof store.dispatch>();

  useEffect(() => {
    dispatch(getUserProfile()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("User profile fetched successfully:", res.payload);
        setUser(res.payload[0]);
      } else {
        console.error("Failed to fetch user profile:", res);
        toast.error("Failed to fetch user profile. Please try again later.");
      }
    });
  }, [dispatch]);

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  // Calculate order total
  const calculateOrderTotal = (items: OrderItem[]): string => {
    return items
      .reduce((total, item) => {
        return total + Number.parseFloat(item.product.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile__header">
          <h1 className="profile__title">My Profile</h1>
        </div>

        {loading ? (
          <div className="profile__message">
            <p className="profile__loading-message">Loading profile data...</p>
          </div>
        ) : error ? (
          <div className="profile__message">
            <p className="profile__error-message">
              Failed to load profile data.
            </p>
          </div>
        ) : user ? (
          <div className="profile__content">
            <div className="profile__user-info">
              <div className="profile__user-header">
                <div className="profile__user-image-container">
                  <img
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                    className="profile__user-image"
                  />
                </div>
                <div className="profile__user-details">
                  <h2 className="profile__user-name">{user.name}</h2>
                  <p className="profile__user-email">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="profile__orders">
              <h2 className="profile__section-title">
                {selectedOrder ? "Order Details" : "Order History"}
              </h2>

              {selectedOrder ? (
                <div className="profile__order-details">
                  <div className="profile__order-summary">
                    <button
                      className="profile__back-button"
                      onClick={handleBackToOrders}
                    >
                      ← Back to Orders
                    </button>

                    <div className="profile__order-info">
                      <div className="profile__order-info-item">
                        <span className="profile__order-info-label">
                          Order ID:
                        </span>
                        <span className="profile__order-info-value">
                          #{selectedOrder.id}
                        </span>
                      </div>
                      <div className="profile__order-info-item">
                        <span className="profile__order-info-label">Date:</span>
                        <span className="profile__order-info-value">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </div>
                      <div className="profile__order-info-item">
                        <span className="profile__order-info-label">
                          Status:
                        </span>
                        <span
                          className={`profile__order-status profile__order-status--${selectedOrder.status.toLowerCase()}`}
                        >
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div className="profile__order-info-item">
                        <span className="profile__order-info-label">
                          Total:
                        </span>
                        <span className="profile__order-info-value">
                          {calculateOrderTotal(selectedOrder.items)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="profile__order-items">
                    <h3 className="profile__order-items-title">Items</h3>

                    <div className="profile__items-header">
                      <span className="profile__header-product">Product</span>
                      <span className="profile__header-price">Price</span>
                      <span className="profile__header-quantity">Quantity</span>
                      <span className="profile__header-total">Total</span>
                    </div>

                    <div className="profile__items">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="profile__item">
                          <div className="profile__item-product">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.title}
                              className="profile__item-image"
                            />
                            <span className="profile__item-name">
                              {item.product.title}
                            </span>
                          </div>

                          <span className="profile__item-price">
                            {item.product.price}
                          </span>

                          <span className="profile__item-quantity">
                            {item.quantity}
                          </span>

                          <span className="profile__item-subtotal">
                            {(
                              Number.parseFloat(item.product.price) *
                              item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : user.orders && user.orders.length > 0 ? (
                <div className="profile__orders-list">
                  <div className="profile__orders-header">
                    <span className="profile__orders-header-id">Order ID</span>
                    <span className="profile__orders-header-date">Date</span>
                    <span className="profile__orders-header-status">
                      Status
                    </span>
                    <span className="profile__orders-header-total">Total</span>
                    <span className="profile__orders-header-actions"></span>
                  </div>

                  {user.orders.map((order) => (
                    <div key={order.id} className="profile__order-item">
                      <span className="profile__order-id">#{order.id}</span>
                      <span className="profile__order-date">
                        {formatDate(order.createdAt)}
                      </span>
                      <span
                        className={`profile__order-status profile__order-status--${order.status.toLowerCase()}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span className="profile__order-total">
                        {calculateOrderTotal(order.items)}
                      </span>
                      <button
                        className="profile__view-details-button"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="profile__message">
                  <p className="profile__empty-message">
                    You haven't placed any orders yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="profile__message">
            <p className="profile__error-message">No user data found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
