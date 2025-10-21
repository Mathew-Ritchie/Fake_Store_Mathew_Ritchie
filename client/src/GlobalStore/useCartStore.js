// // src/store/cartStore.js
// import { create } from "zustand";

// export const useCartStore = create((set, get) => ({
//   cart: [],
//   loading: false,
//   error: null,

//   fetchCart: async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return set({ error: "Not logged in" });

//     set({ loading: true, error: null });

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to load cart");

//       set({ cart: data.cart || data, loading: false });
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   addToCart: async (itemId) => {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ itemId }),
//     });
//     const data = await res.json();
//     set({ cart: data.cart });
//   },
// }));
