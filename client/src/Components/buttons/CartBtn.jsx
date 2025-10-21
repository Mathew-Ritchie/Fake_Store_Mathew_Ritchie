import React from "react";
import { Link } from "react-router";
import { IoCartOutline, IoCartSharp } from "react-icons/io5";
import "./cart-btn.css";
import { useEffect, useMemo } from "react";
import useCartStore from "../../GlobalStore/useCartStore";

export default function Cart() {
  const { cart } = useCartStore();

  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    console.log("Current cart length:", cart.length);
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
