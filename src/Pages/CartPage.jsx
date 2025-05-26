import React from "react";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useGlobalStore();

  console.log(cart);

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty-message">
        <h2>Your Shopping Cart</h2>
        <p>Your cart is empty. Start adding some awesome products!</p>
        {/* You might want to add a link back to your store/products page here */}
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
            className="cart-item-image"
          />
          <div className="cart-item-details">
            <h3 className="cart-item-title">{item.title}</h3>
            {item.price && <p className="cart-item-price">${item.price.toFixed(2)}</p>}
            <div className="cart-item-quantity-controls">
              <button onClick={() => addToCart(item)} className="quantity-btn add-btn">
                +
              </button>
              <p className="cart-item-quantity">{item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)} className="quantity-btn remove-btn">
                -
              </button>
            </div>
            {item.price && item.quantity && (
              <p className="cart-item-subtotal">
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="cart-total">
        <h3>
          Total: $
          {cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)}
        </h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
}
