// GlobalStore/useCartStore.js
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  // Fetch user's cart from backend
  fetchCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. Skipping cart fetch.");
        return;
      }

      const res = await fetch("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const cartItems = Array.isArray(data) ? data : data.cart || [];
      set({ cart: cartItems });
    } catch (err) {
      console.error(" Failed to fetch cart:", err);
      set({ cart: [] });
    }
  },

  //  Add an item to the cart
  addToCart: async (item) => {
    try {
      // 1. CRITICAL FIX: Define token inside the function scope
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("User not authenticated");
        return;
      }

      // 2. LOGIC: Determine the stable product ID
      // item.item_id is used when adding from the Cart Page (item retrieved from DB)
      // item.id is used when adding from the Products Page (original product ID)
      const productIdentifier = item.item_id || item.id;

      if (!productIdentifier) {
        console.error(" Cannot add to cart: Missing item identifier.");
        return;
      }

      const res = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the correctly scoped token
        },
        body: JSON.stringify({
          itemId: productIdentifier, // Use the stable product identifier
          title: item.title,
        }),
      });

      // 3. BEST PRACTICE: Check for non-2xx response status
      if (!res.ok) {
        const errorText = await res.text();
        console.error(` Failed to add to cart: ${res.status} ${errorText}`);
        return;
      }

      const data = await res.json();
      const cartItems = Array.isArray(data) ? data : data.cart || [];
      set({ cart: cartItems });
    } catch (err) {
      console.error(" Failed to add to cart:", err);
    }
  },

  //  Remove one quantity (or delete item if quantity = 1)
  removeFromCart: async (itemId) => {
    console.log(" Removing from cart:", itemId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn(" User not authenticated – no token found");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error(` Failed to remove item: ${res.status} ${msg}`);
        return;
      }

      const data = await res.json();
      const updatedCart = Array.isArray(data) ? data : data.cart || [];

      set({ cart: updatedCart });
      console.log("🗑️ Item removed, updated cart:", updatedCart);
    } catch (err) {
      console.error(" Failed to remove item from cart:", err);
    }
  },

  //  Clear the entire cart
  clearCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("User not authenticated");
        return;
      }

      const res = await fetch("http://localhost:8000/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const cartItems = Array.isArray(data) ? data : data.cart || [];
      set({ cart: cartItems });
    } catch (err) {
      console.error(" Failed to clear cart:", err);
    }
  },

  syncClearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;
