import React, { useEffect, useState } from "react";
import "./Cart.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../redux/store";
import {
  clearCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "../../redux/Slices/cart/cartThunks";
import { toast } from "react-toastify";
import { createOrder, getOrders } from "../../redux/Slices/order/orderThunks";

interface Product {
  productId: number;
  productName: string;
  productPrice: string;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const { loading, error } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(getCartItems()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Cart items fetched successfully:", res.payload);
        setCart(res.payload);
      } else {
        console.error("Failed to fetch cart items:", res);
      }
    });
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch cart items. Please try again later.");
    }
  }, [error]);

  useEffect(() => {
    dispatch(getOrders()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Orders fetched successfully:", res.payload);
      } else {
        console.error("Failed to fetch orders:", res);
      }
    });
  }, []);

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateCartItem({ id, data: { quantity } })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Cart item updated successfully.");
      } else {
        toast.error("Failed to update cart item. Please try again.");
      }
    });
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.productId === id
          ? { ...product, quantity: Math.max(1, quantity) }
          : product
      )
    );
  };

  const handleRemove = (id: number) => {
    dispatch(deleteCartItem(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Item removed from cart successfully.");
        setCart((prevCart) =>
          prevCart.filter((product) => product.productId !== id)
        );
      } else {
        toast.error("Failed to remove item from cart. Please try again.");
      }
    });
  };

  const totalPrice =
    cart &&
    cart.length > 0 &&
    cart.reduce(
      (total, product) =>
        total + parseFloat(product.productPrice) * product.quantity,
      0
    );

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log("Proceeding to checkout with items:", cart);
    dispatch(createOrder(cart)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Order placed successfully.");
        // Clear the cart after successful order

        dispatch(clearCart()).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            console.log("Cart cleared successfully:", res.payload);
            setCart([]);
          } else {
            console.error("Failed to clear cart:", res);
            toast.error(
              "Failed to clear cart after placing order. Please try again."
            );
          }
        });
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    });
  };

  return (
    <div className="cart-container">
      <div className="cart">
        <div className="cart__header">
          <h1 className="cart__title">Shopping Cart</h1>
          <span className="cart__count">{cart?.length || 0} items</span>
        </div>

        {loading ? (
          <div className="cart__message">
            <p className="cart__loading-message">Loading cart items...</p>
          </div>
        ) : error ? (
          <div className="cart__message">
            <p className="cart__error-message">Failed to load cart items.</p>
          </div>
        ) : cart?.length === 0 ? (
          <div className="cart__message">
            <p className="cart__empty-message">Your cart is empty.</p>
          </div>
        ) : (
          <div className="cart__content">
            <div className="cart__items-container">
              <div className="cart__items-header">
                <span className="cart__header-product">Product</span>
                <span className="cart__header-price">Price</span>
                <span className="cart__header-quantity">Quantity</span>
                <span className="cart__header-total">Total</span>
                <span className="cart__header-actions"></span>
              </div>

              <div className="cart__items">
                {cart && cart.length > 0 ? (
                  cart.map((product: Product, index) => (
                    <div key={index} className="cart__item">
                      <div className="cart__item-product">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.productName}
                          className="cart__item-image"
                        />
                        <span className="cart__item-name">
                          {product.productName}
                        </span>
                      </div>

                      <span className="cart__item-price">
                        {product.productPrice}
                      </span>

                      <div className="cart__item-quantity-controls">
                        <button
                          className="cart__item-decrement"
                          onClick={() =>
                            handleQuantityChange(
                              product.productId,
                              product.quantity - 1
                            )
                          }
                          disabled={product.quantity === 1}
                        >
                          {"-"}
                        </button>
                        <span className="cart__item-quantity">
                          {product.quantity}
                        </span>
                        <button
                          className="cart__item-increment"
                          onClick={() =>
                            handleQuantityChange(
                              product.productId,
                              product.quantity + 1
                            )
                          }
                        >
                          {"+"}
                        </button>
                      </div>

                      <span className="cart__item-subtotal">
                        {(
                          parseFloat(product.productPrice) * product.quantity
                        ).toFixed(2)}
                      </span>

                      <button
                        className="cart__item-remove"
                        onClick={() => handleRemove(product.productId)}
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="cart__empty-message">Your cart is empty.</p>
                )}
              </div>
            </div>

            {cart?.length > 0 && (
              <div className="cart__summary">
                <h2 className="cart__summary-title">Order Summary</h2>

                <div className="cart__summary-row">
                  <span className="cart__summary-label">Subtotal:</span>
                  <span className="cart__summary-value">
                    {(totalPrice || 0).toFixed(2)}
                  </span>
                </div>

                <div className="cart__summary-row">
                  <span className="cart__summary-label">Shipping:</span>
                  <span className="cart__summary-value">Free</span>
                </div>

                <div className="cart__summary-divider"></div>

                <div className="cart__summary-row cart__summary-total">
                  <span className="cart__summary-label">Total:</span>
                  <span className="cart__summary-value">
                    {(totalPrice || 0).toFixed(2)}
                  </span>
                </div>

                <button
                  className="cart__checkout-button"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
