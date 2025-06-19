import React from "react";
import { Link } from "react-router";

import useCartStore from "../GlobalStore/useCartStore";
import useAuthStore from "../GlobalStore/useAuthStore";
import { IoIosArrowRoundBack } from "react-icons/io";

import "./cart-page.css";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();

  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.uid || null;
  // console.log(cart);

  // If there is no cart or the cart length is 0
  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty-message">
        <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link>
        <h2>Your Shopping Cart</h2>
        <p>Your cart is empty. Start adding some awesome products!</p>
      </div>
    );
  }

  //If there are items in the cart
  return (
    <div className="cart-container">
      {/* Back button and subheading */}
      <div className="cart-heading-and-home-btn">
        <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link>
        <h2>Your Shopping Cart</h2>
      </div>

      {/* map() to add each product in the cart to the UI */}
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <Link to={`/item/${item.id}`}>
            <img src={item.image} alt={item.title} className="cart-item-image" />
          </Link>
          <div className="cart-item-details">
            <h5 className="cart-item-title">{item.title}</h5>
            {item.price && <p className="cart-item-price">R{item.price.toFixed(2)}</p>}

            {/* Add and deduct buttons with quantity in cart */}
            <div className="cart-item-quantity-controls">
              <button
                onClick={() => addToCart(item, currentUserId)}
                className="quantity-btn add-btn"
              >
                +
              </button>
              <p className="cart-item-quantity">{item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id, currentUserId)}
                className="quantity-btn remove-btn"
              >
                -
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Total and checkout button */}
      <div className="cart-total">
        <h3>
          Total: R
          {cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)}
        </h3>
        <button onClick={() => clearCart(currentUserId)} className="checkout-btn button-style-1">
          Clear cart
        </button>
        <button className="checkout-btn button-style-1">Proceed to Checkout</button>
      </div>
    </div>
  );
}
