import React from "react";
import { IoCartOutline, IoCartSharp } from "react-icons/io5";
import "./cart.css";
import { useEffect, useMemo } from "react";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function Cart() {
  const { cart } = useGlobalStore();

  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    console.log("Current cart length:", cart.length);
  }, [cart]);

  return (
    <div>
      {cart.length === 0 ? (
        <IoCartOutline className="cart-icon" />
      ) : (
        <IoCartSharp className="cart-icon" />
      )}
      {cart.length > 0 && <span className="cart-item-count">{totalQuantity}</span>}
    </div>
  );
}
