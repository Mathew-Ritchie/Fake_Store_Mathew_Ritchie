import { create } from "zustand";

// API_URL is correctly set to https://fake-store-mathew-ritchie.onrender.com/api
const API_URL = import.meta.env.VITE_API_BASE_URL;

const useFavouritesStore = create((set, get) => ({
  // State initialization: Start with an empty array. No localStorage used.
  favourites: [],

  /**
   * Fetch favourites from backend for logged-in user
   * Requires: User must be logged in.
   */
  fetchFavourites: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If not logged in, state remains empty, and we exit silently.
      set({ favourites: [] });
      return;
    }

    try {
      // FIX: Appending /favourites to hit the correct GET endpoint
      const res = await fetch(`${API_URL}/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(" Failed to fetch favourites from backend");
        return;
      }

      const data = await res.json();
      // The backend should return { favourites: [...] }
      const favourites = Array.isArray(data) ? data : data.favourites || [];

      // Update state directly from server response
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
    if (!product || typeof product.id === "undefined") {
      console.warn("Invalid product passed to toggleFavourite:", product);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Must be logged in to toggle favourites.");
      return; // Exit if not logged in
    }

    try {
      // FIX: Appending /favourites to hit the correct POST endpoint
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
        //  Update state ONLY with the confirmed list from the server
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
    // Relies solely on the current state synced from the backend
    const { favourites } = get();
    return favourites.some((item) => item.item_id === productId || item.id === productId);
  },

  /**
   * Remove a specific product from favourites
   * Requires: User must be logged in.
   */
  removeFavourite: async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) return; // Exit if not logged in

    try {
      // The URL for DELETE ONE is already correct: /api/favourites/:itemId
      const res = await fetch(`${API_URL}/favourites/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Update state with the new list returned by the server
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
    const token = localStorage.getItem("token");
    if (!token) return; // Exit if not logged in

    try {
      // FIX: Appending /favourites to hit the correct DELETE ALL endpoint
      const res = await fetch(`${API_URL}/favourites`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // The server should return an empty array if successful
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
