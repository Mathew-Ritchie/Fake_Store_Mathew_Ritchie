import React, { useState, useEffect } from "react";
import "./add-to-cart-btn.css";
import useGlobalStore from "../../GlobalStore/useGlobalStore";

export default function AddToCartBtn() {
  const { productInfo, addToCart } = useGlobalStore();
  const [addToCartMessage, setAddToCartMessage] = useState("");

  const handleAddToCart = () => {
    if (!productInfo || !productInfo.id) {
      setAddToCartMessage("Error: Product information not available.");
      return;
    }

    addToCart(productInfo);

    setAddToCartMessage(`${productInfo.title} added to cart!`);

    setTimeout(() => {
      setAddToCartMessage("");
    }, 3000);
  };

  const addToCartBtnStyle = {
    backgroundColor: "green",
    color: "white",
    width: "200px",
  };

  return (
    <div>
      <button className="add-to-cart-btn" style={addToCartBtnStyle} onClick={handleAddToCart}>
        Add to cart
      </button>
      {addToCartMessage && <p className="add-to-cart-message">{addToCartMessage}</p>}
    </div>
  );
}
