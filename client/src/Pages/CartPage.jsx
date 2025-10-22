import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HomeButton from "../Components/buttons/HomeButton";
import useCartStore from "../GlobalStore/useCartStore";
import { useUserStore } from "../GlobalStore/useUserStore";

export default function CartPage() {
  const { cart, fetchCart, addToCart, removeFromCart, clearCart } = useCartStore();
  const user = useUserStore((state) => state.user);

  // Fetch cart on mount
  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty-message">
        <HomeButton />
        <h2>Your Shopping Cart</h2>
        <p>Your cart is empty. Start adding some awesome products!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-home-btn-div">
        <HomeButton />
      </div>
      <h2 className="cart-page-sub-title">Your Shopping Cart</h2>

      <div className="cart-items-div">
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
                <button
                  onClick={() => removeFromCart(item.item_id)}
                  className="quantity-btn remove-btn"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>
          Total: R
          {cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)}
        </h3>
        <div className="cart-page-clear-cheackout-btn-div">
          <button onClick={clearCart} className="clear-btn button-style-1">
            Clear cart
          </button>
          <button className="checkout-btn button-style-1">Checkout</button>
        </div>
      </div>
    </div>
  );
}
