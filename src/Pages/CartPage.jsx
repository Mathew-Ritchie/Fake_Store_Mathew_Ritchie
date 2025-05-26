import React from "react";
import { Link } from "react-router";
import useGlobalStore from "../GlobalStore/useGlobalStore";
import { IoIosArrowRoundBack } from "react-icons/io";
import "./cart-page.css";

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useGlobalStore();

  // console.log(cart);

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty-message">
        <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link>
        <h2>Your Shopping Cart</h2>
        <p>Your cart is empty. Start adding some awesome products!</p>
        {/* You might want to add a link back to your store/products page here */}
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-heading-and-home-btn">
        <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link>
        <h2>Your Shopping Cart</h2>
      </div>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <Link to={`/item/${item.id}`}>
            <img src={item.image} alt={item.title} className="cart-item-image" />
          </Link>
          <div className="cart-item-details">
            <h5 className="cart-item-title">{item.title}</h5>
            {item.price && <p className="cart-item-price">R{item.price.toFixed(2)}</p>}
            <div className="cart-item-quantity-controls">
              <button onClick={() => addToCart(item)} className="quantity-btn add-btn">
                +
              </button>
              <p className="cart-item-quantity">{item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)} className="quantity-btn remove-btn">
                -
              </button>
            </div>
            {/* {item.price && item.quantity && (
              <p className="cart-item-subtotal">
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            )} */}
          </div>
        </div>
      ))}
      <div className="cart-total">
        <h3>
          Total: R
          {cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)}
        </h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
}
