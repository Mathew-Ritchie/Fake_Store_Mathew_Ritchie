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
      console.error("❌ Failed to fetch cart:", err);
      set({ cart: [] });
    }
  },

  // ✅ Add an item to the cart
  addToCart: async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("User not authenticated");
        return;
      }

      const res = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
        }),
      });

      const data = await res.json();
      const cartItems = Array.isArray(data) ? data : data.cart || [];
      set({ cart: cartItems });
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
    }
  },

  // ✅ Remove one quantity (or delete item if quantity = 1)
  removeFromCart: async (itemId) => {
    console.log("🧩 Removing from cart:", itemId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("❌ User not authenticated – no token found");
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
        console.error(`❌ Failed to remove item: ${res.status} ${msg}`);
        return;
      }

      const data = await res.json();
      const updatedCart = Array.isArray(data) ? data : data.cart || [];

      set({ cart: updatedCart });
      console.log("🗑️ Item removed, updated cart:", updatedCart);
    } catch (err) {
      console.error("❌ Failed to remove item from cart:", err);
    }
  },

  // ✅ Clear the entire cart
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
      console.error("❌ Failed to clear cart:", err);
    }
  },
}));

export default useCartStore;
