// import React, { useState, useEffect } from "react";

// import useCartStore from "../../GlobalStore/useCartStore";
// import useProductsStore from "../../GlobalStore/useProductStore";
// import useAuthStore from "../../GlobalStore/useAuthStore";

// export default function AddToCartBtn() {
//   const { productInfo } = useProductsStore();
//   const { addToCart } = useCartStore();

//   const user = useAuthStore((state) => state.user);
//   const userId = user?.uid || null;

//   const [addToCartMessage, setAddToCartMessage] = useState("");

//   const handleAddToCart = () => {
//     if (!productInfo || !productInfo.id) {
//       setAddToCartMessage("Error: Product information not available.");

//       setTimeout(() => {
//         setAddToCartMessage("");
//       }, 3000);
//       return;
//     }

//     addToCart(productInfo, userId);

//     setAddToCartMessage(`${productInfo.title} added to cart!`);

//     setTimeout(() => {
//       setAddToCartMessage("");
//     }, 3000);
//   };

//   return (
//     <div>
//       <button className="add-to-cart-btn button-style-1" onClick={handleAddToCart}>
//         Add to cart
//       </button>
//       {addToCartMessage && <p className="add-to-cart-message">{addToCartMessage}</p>}
//     </div>
//   );
// }
