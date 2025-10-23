import { create } from "zustand";

const API_URL = "http://localhost:8000/api/favourites";

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
      const res = await fetch(API_URL, {
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
      //  Direct call to the backend for the toggle action
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
      const res = await fetch(`${API_URL}/${itemId}`, {
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
   * Clear all favourites
   * Requires: User must be logged in.
   */
  clearFavourites: async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Exit if not logged in

    try {
      const res = await fetch(API_URL, {
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
   * Clear all favourites (locally ONLY, preserves backend data)
   */
  clearFavourites: () => {
    set({ favourites: [] });
  },
}));

export default useFavouritesStore;
