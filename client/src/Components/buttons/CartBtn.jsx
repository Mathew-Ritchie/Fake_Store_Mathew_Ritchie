import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { IoCartOutline, IoCartSharp } from "react-icons/io5";

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
          <IoCartOutline className=" text-2xl text-white bg-transparent border-0" />
        ) : (
          <IoCartSharp className=" text-2xl text-white bg-transparent border-0" />
        )}
        {cart.length > 0 && (
          <span className="cart-item-count bg-green-800 rounded-full text-white text-xs p-0.5 ">
            {totalQuantity}
          </span>
        )}
      </div>
    </Link>
  );
}
