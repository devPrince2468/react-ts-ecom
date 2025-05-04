import React, { useEffect, useState } from "react";
import "./Cart.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../redux/store";
import {
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "../../redux/Slices/cart/cartThunks";
import { toast } from "react-toastify";

interface Product {
  productId: number;
  productName: string;
  productPrice: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const dispatch = useDispatch<typeof store.dispatch>();
  const { loading, error, items } = useSelector(
    (state: RootState) => state.cart
  );

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
    // setCart((prevCart) => prevCart.filter((product) => product.id !== id));
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

  return (
    <div className="cart">
      <h1 className="cart__title">Shopping Cart</h1>
      {loading ? (
        <p className="cart__loading-message">Loading cart items...</p>
      ) : error ? (
        <p className="cart__error-message">Failed to load cart items.</p>
      ) : cart?.length === 0 ? (
        <p className="cart__empty-message">Your cart is empty.</p>
      ) : (
        <div className="cart__items">
          {cart && cart.length > 0 ? (
            cart.map((product: Product, index) => (
              <div key={index} className="cart__item">
                <span className="cart__item-name">{product.productName}</span>
                <span className="cart__item-price">
                  ${product.productPrice}
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
                    -
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
                    +
                  </button>
                </div>
                <button
                  className="cart__item-remove"
                  onClick={() => handleRemove(product.productId)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="cart__empty-message">Your cart is empty.</p>
          )}
        </div>
      )}
      {cart?.length > 0 && (
        <div className="cart__total">
          <h2 className="cart__total-label">Total:</h2>
          <span className="cart__total-value">
            ${(totalPrice || 0).toFixed(2)}
          </span>
        </div>
      )}

      {cart?.length > 0 && (
        <div className="cart__checkout">
          <button className="cart__checkout-button">Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
