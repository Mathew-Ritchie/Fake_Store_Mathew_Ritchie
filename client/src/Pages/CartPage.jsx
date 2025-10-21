// import React from "react";
// import { Link } from "react-router";

// import useCartStore from "../GlobalStore/useCartStore";
// import useAuthStore from "../GlobalStore/useAuthStore";
// import { IoIosArrowRoundBack } from "react-icons/io";

// // import "./cart-page.css";
// import HomeButton from "../Components/buttons/HomeButton";

// export default function CartPage() {
//   const { cart, addToCart, removeFromCart, clearCart } = useCartStore();

//   const user = useAuthStore((state) => state.user);
//   const currentUserId = user?.uid || null;
//   // console.log(cart);

//   // If there is no cart or the cart length is 0
//   if (!cart || cart.length === 0) {
//     return (
//       <div className="cart-empty-message">
//         <HomeButton />
//         {/* <Link to={"/"} className="product-page-header-link">
//           <IoIosArrowRoundBack className="back-arrow" />
//         </Link> */}
//         <h2>Your Shopping Cart</h2>
//         <p>Your cart is empty. Start adding some awesome products!</p>
//       </div>
//     );
//   }

//   //If there are items in the cart
//   return (
//     <div className="cart-container">
//       {/* Back button and subheading */}
//       <div className="cart-home-btn-div">
//         <HomeButton />
//         {/* <Link to={"/"} className="cart-page-header-link">
//           <IoIosArrowRoundBack className="back-arrow" />
//           <h2>HOME</h2>
//         </Link> */}
//       </div>
//       <h2 className="cart-page-sub-title">Your Shopping Cart</h2>
//       {/* map() to add each product in the cart to the UI */}
//       <div className="cart-items-div">
//         {cart.map((item) => (
//           <div key={item.id} className="cart-item">
//             <Link to={`/item/${item.id}`}>
//               <img src={item.image} alt={item.title} className="cart-item-image" />
//             </Link>
//             <div className="cart-item-details">
//               <h5 className="cart-item-title">{item.title}</h5>
//               {item.price && <p className="cart-item-price">R{item.price.toFixed(2)}</p>}

//               {/* Add and deduct buttons with quantity in cart */}
//               <div className="cart-item-quantity-controls">
//                 <button
//                   onClick={() => addToCart(item, currentUserId)}
//                   className="quantity-btn add-btn"
//                 >
//                   +
//                 </button>
//                 <p className="cart-item-quantity">{item.quantity}</p>
//                 <button
//                   onClick={() => removeFromCart(item.id, currentUserId)}
//                   className="quantity-btn remove-btn"
//                 >
//                   -
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Total and checkout button */}
//       <div className="cart-total">
//         <h3>
//           Total: R
//           {cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)}
//         </h3>
//         <div className="cart-page-clear-cheackout-btn-div">
//           <button onClick={() => clearCart(currentUserId)} className="clear-btn button-style-1">
//             Clear cart
//           </button>
//           <button className="checkout-btn button-style-1">Checkout</button>
//         </div>
//       </div>
//     </div>
//   );
// }
