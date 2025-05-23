import React, { useState, useEffect } from "react";
import "./add-to-cart-btn.css";
import useGlobalStore from "../../GlobalStore/useGlobalStore";

export default function AddToCartBtn() {
  const { productInfo } = useGlobalStore();
  const [addToCartMessage, setAddToCartMessage] = useState("");

  const handleAddToCart = () => {
    if (!productInfo || !productInfo.id) {
      setAddToCartMessage("Error: Product information not available.");
      return;
    }
    const currentCart = JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]");
    const existingProductIndex = currentCart.findIndex((item) => item.id === productInfo.id);
    if (existingProductIndex > -1) {
      currentCart[existingProductIndex].quantity += 1;
      setAddToCartMessage(`Added another ${productInfo.title} to cart!`);
    } else {
      currentCart.push({ ...productInfo, quantity: 1 });
      setAddToCartMessage(`${productInfo.title} added to cart!`);
    }
    localStorage.setItem("myFakeStoreCart", JSON.stringify(currentCart));

    setTimeout(() => {
      setAddToCartMessage("");
    }, 3000);
  };

  return (
    <div>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  );
}
