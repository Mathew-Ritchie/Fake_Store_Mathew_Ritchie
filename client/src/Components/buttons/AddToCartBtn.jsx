import React, { useState } from "react";
import useCartStore from "../../GlobalStore/useCartStore";
import useProductsStore from "../../GlobalStore/useProductStore";
import { useUserStore } from "../../GlobalStore/useUserStore";

export default function AddToCartBtn() {
  const { productInfo } = useProductsStore();
  const { addToCart, fetchCart } = useCartStore();
  const user = useUserStore((state) => state.user);
  const [addToCartMessage, setAddToCartMessage] = useState("");

  const handleAddToCart = async () => {
    if (!user) {
      setAddToCartMessage("Please log in to add items to your cart.");
      setTimeout(() => setAddToCartMessage(""), 3000);
      return;
    }

    if (!productInfo || !productInfo.id) {
      setAddToCartMessage("Error: Product information not available.");
      setTimeout(() => setAddToCartMessage(""), 3000);
      return;
    }

    try {
      await addToCart(productInfo);
      await fetchCart(); // Refresh the cart count immediately

      setAddToCartMessage(`${productInfo.title} added to cart!`);
      setTimeout(() => setAddToCartMessage(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddToCartMessage("Failed to add item to cart.");
      setTimeout(() => setAddToCartMessage(""), 3000);
    }
  };

  return (
    <div>
      <button className="add-to-cart-btn button-style-1" onClick={handleAddToCart}>
        Add to cart
      </button>
      {addToCartMessage && <p className="add-to-cart-message">{addToCartMessage}</p>}
    </div>
  );
}
