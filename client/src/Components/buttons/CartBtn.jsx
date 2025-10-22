import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { IoCartOutline, IoCartSharp } from "react-icons/io5";
import "./cart-btn.css";
import useCartStore from "../../GlobalStore/useCartStore";
import { useUserStore } from "../../GlobalStore/useUserStore";

export default function Cart() {
  const { cart, fetchCart, setCart } = useCartStore();
  const user = useUserStore((state) => state.user);

  // Fetch cart whenever user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
    }
  }, [user, fetchCart]);

  // Compute total quantity
  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  return (
    <Link to={"/cart"}>
      <div>
        {cart.length === 0 ? (
          <IoCartOutline className="cart-icon icons" />
        ) : (
          <IoCartSharp className="cart-icon icons" />
        )}
        {cart.length > 0 && <span className="cart-item-count">{totalQuantity}</span>}
      </div>
    </Link>
  );
}
