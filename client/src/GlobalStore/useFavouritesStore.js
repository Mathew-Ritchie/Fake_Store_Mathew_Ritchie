// useFavouritesStore.js (Updated)

import { create } from "zustand";

// API_URL is correctly set to https://fake-store-mathew-ritchie.onrender.com/api
const API_URL = import.meta.env.VITE_API_BASE_URL;

const useFavouritesStore = create((set, get) => ({
  // State initialization: Start with an empty array. No localStorage used.
  favourites: [],

  // ... (fetchFavourites, toggleFavourite functions are unchanged as they are not the source of the bug)

  /**
   * Fetch favourites from backend for logged-in user
   * Requires: User must be logged in.
   */
  fetchFavourites: async () => {
    // ... (logic unchanged)
    const token = localStorage.getItem("token");
    if (!token) {
      set({ favourites: [] });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(" Failed to fetch favourites from backend");
        return;
      }

      const data = await res.json();
      const favourites = Array.isArray(data) ? data : data.favourites || [];
      set({ favourites });
    } catch (err) {
      console.error(" Error fetching favourites:", err);
    }
  },

  /**
   * Toggle a product as favourite (add/remove)
   * Requires: User must be logged in.
   */
  toggleFavourite: async (product) => {
    // ... (logic unchanged)
    if (!product || typeof product.id === "undefined") {
      console.warn("Invalid product passed to toggleFavourite:", product);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Must be logged in to toggle favourites.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/favourites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: product.id,
          title: product.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const favouritesFromServer = Array.isArray(data) ? data : data.favourites || [];
        set({ favourites: favouritesFromServer });
        console.log(`Favourite state synced with server.`);
      } else {
        console.error(` Failed to sync favourite. Status: ${res.status}`);
      }
    } catch (err) {
      console.error(" Error syncing favourite to backend:", err);
    }
  },

  /**
   * Check if product is currently favourited
   */
  isProductFavourite: (productId) => {
    // FIX: Convert both IDs to strings for a reliable strict comparison
    const targetId = String(productId);
    const { favourites } = get();

    // We check against item_id (the product's actual ID from the external store)
    // The previous check against item.id was likely comparing to the favourite record's PRIMARY KEY, which is wrong.
    return favourites.some((item) => String(item.item_id) === targetId);
  },

  /**
   * Remove a specific product from favourites
   * Requires: User must be logged in.
   */
  removeFavourite: async (itemId) => {
    // ... (logic unchanged)
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/favourites/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const favouritesFromServer = Array.isArray(data) ? data : data.favourites || [];
        set({ favourites: favouritesFromServer });
      }
    } catch (err) {
      console.error(" Failed to remove favourite from backend:", err);
    }
  },

  /**
   * Clear all favourites (Asynchronous backend call)
   * Requires: User must be logged in.
   */
  clearFavourites: async () => {
    // ... (logic unchanged)
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/favourites`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        set({ favourites: [] });
      }
    } catch (err) {
      console.error(" Failed to clear favourites on backend:", err);
    }
  },

  /**
   * Clear all favourites (Locally ONLY, preserves backend data)
   * NOTE: This is a duplicate function name and should be renamed (e.g., clearLocalFavourites)
   */
  clearLocalFavourites: () => {
    set({ favourites: [] });
  },
}));

export default useFavouritesStore;
