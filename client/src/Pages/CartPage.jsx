import React from "react";
import BackButton from "../Components/buttons/NavigateButton";
import CartContents from "../Components/CartContents";
import ClearAllButton from "../Components/buttons/ClearAllBtn";
import useCartStore from "../GlobalStore/useCartStore";
import NavigateButton from "../Components/buttons/NavigateButton";

export default function CartPage() {
  const { clearCart, cart } = useCartStore();

  return (
    <div className="cart-page-container bg-gray-100 w-full flex flex-col items-center">
      <NavigateButton label="BACK" path={-1} />
      <h2 className="cart-page-sub-title text-center w-full sm:w-[500px] bg-white py-8 text-3xl">
        Your Shopping Cart
      </h2>

      {/* Cart display section */}
      <CartContents />

      {/* Cart controls */}
      {cart && cart.length > 0 && (
        <div className="flex justify-end gap-2 w-full sm:w-[500px] bg-white py-4 px-4">
          <ClearAllButton onClick={clearCart} message="Clear cart" />
          <button className="checkout-btn button-style-1">Check-out</button>
        </div>
      )}
    </div>
  );
}
