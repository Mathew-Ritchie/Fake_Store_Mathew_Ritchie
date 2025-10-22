// stores/useFavouritesStore.js
import { create } from "zustand";

const API_URL = "http://localhost:8000/api/favourites";

const useFavouritesStore = create((set, get) => ({
  favourites: JSON.parse(localStorage.getItem("myFakeStoreFavourites") || "[]"),

  /**
   * Fetch favourites from backend for logged-in user
   */
  fetchFavourites: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User not authenticated, using local favourites only.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(" Failed to fetch favourites from backend");
        return;
      }

      const data = await res.json();
      const favourites = Array.isArray(data) ? data : data.favourites || [];

      localStorage.setItem("myFakeStoreFavourites", JSON.stringify(favourites));
      set({ favourites });
    } catch (err) {
      console.error("❌ Error fetching favourites:", err);
    }
  },

  /**
   * Toggle a product as favourite (add/remove)
   * Syncs with backend if user is logged in.
   */
  toggleFavourite: async (product) => {
    if (!product || typeof product.id === "undefined") {
      console.warn("Invalid product passed to toggleFavourite:", product);
      return;
    }

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const { favourites } = get();

    // Determine if product is already favourited
    const existingIndex = favourites.findIndex((fav) => fav.item_id === product.id);

    // Optimistic local update
    let updatedFavourites;
    if (existingIndex !== -1) {
      updatedFavourites = favourites.filter((fav) => fav.item_id !== product.id);
      console.log(`${product.title || "Item"} removed from favourites.`);
    } else {
      updatedFavourites = [
        ...favourites,
        {
          item_id: product.id,
          title: product.title,
        },
      ];
      console.log(`${product.title || "Item"} added to favourites.`);
    }

    set({ favourites: updatedFavourites });
    localStorage.setItem("myFakeStoreFavourites", JSON.stringify(updatedFavourites));

    // Sync with backend
    if (isLoggedIn) {
      try {
        const res = await fetch(API_URL, {
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
          localStorage.setItem("myFakeStoreFavourites", JSON.stringify(favouritesFromServer));
        }
      } catch (err) {
        console.error(" Error syncing favourite to backend:", err);
      }
    }
  },

  /**
   * Check if product is currently favourited
   */
  isProductFavourite: (productId) => {
    const { favourites } = get();
    return favourites.some((item) => item.item_id === productId || item.id === productId);
  },

  /**
   * Remove a specific product from favourites
   */
  removeFavourite: async (itemId) => {
    const token = localStorage.getItem("token");
    const { favourites } = get();

    const updatedFavourites = favourites.filter(
      (item) => item.item_id !== itemId && item.id !== itemId
    );

    set({ favourites: updatedFavourites });
    localStorage.setItem("myFakeStoreFavourites", JSON.stringify(updatedFavourites));

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const favouritesFromServer = Array.isArray(data) ? data : data.favourites || [];
        set({ favourites: favouritesFromServer });
        localStorage.setItem("myFakeStoreFavourites", JSON.stringify(favouritesFromServer));
      }
    } catch (err) {
      console.error(" Failed to remove favourite from backend:", err);
    }
  },

  /**
   * Clear all favourites (both locally and on backend)
   */
  clearFavourites: async () => {
    set({ favourites: [] });
    localStorage.removeItem("myFakeStoreFavourites");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(API_URL, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(" Failed to clear favourites on backend:", err);
    }
  },
}));

export default useFavouritesStore;
