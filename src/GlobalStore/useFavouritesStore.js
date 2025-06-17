// stores/useFavouritesStore.js
import { create } from "zustand";

/**
 * Zustand store for managing a user's favourite products.
 * Favourites are persisted in local storage.
 * @typedef {Object} FavouritesStore
 * @property {Array<object>} favourites - An array of favourite product objects.
 * @property {function(object): void} toggleFavourite - Adds or removes a product from the favourites list.
 * @property {function(number): boolean} isProductFavourite - Checks if a product is currently in the favourites list.
 * @property {function(): void} clearFavourites - Clears all items from the favourites list.
 */
const useFavouritesStore = create((set, get) => ({
  /**
   * The current list of favourite product items.
   * Initialized by attempting to parse data from `localStorage` under the key "myFakeStoreFavourites".
   * If no data is found or parsing fails, it defaults to an empty array.
   * @type {Array<object>}
   */
  favourites: JSON.parse(localStorage.getItem("myFakeStoreFavourites") || "[]"),

  /**
   * Toggles a product's favourite status. If the product is already in favourites, it removes it.
   * If it's not in favourites, it adds it. The updated favourites list is also persisted
   * to `localStorage`.
   * @param {object} productToToggle - The product object to add or remove from favourites.
   * Must have an `id` property.
   * @returns {void}
   */
  toggleFavourite: (productToToggle) =>
    set((state) => {
      if (!productToToggle || typeof productToToggle.id === "undefined") {
        console.warn("toggleFavourite: Invalid product provided (missing ID).", productToToggle);
        return {}; // Return empty object to indicate no state change
      }

      const newFavourites = [...state.favourites];
      const existingFavouriteIndex = newFavourites.findIndex(
        (favItem) => favItem.id === productToToggle.id
      );

      if (existingFavouriteIndex !== -1) {
        newFavourites.splice(existingFavouriteIndex, 1);
        console.log(`${productToToggle.title || "An item"} removed from favourites.`);
      } else {
        newFavourites.push({ ...productToToggle });
        console.log(`${productToToggle.title || "An item"} added to favourites.`);
      }

      localStorage.setItem("myFakeStoreFavourites", JSON.stringify(newFavourites));
      return { favourites: newFavourites };
    }),

  /**
   * Checks if a product with a given ID is currently in the favourites list.
   * @param {number} productId - The unique ID of the product to check.
   * @returns {boolean} True if the product is a favourite, false otherwise.
   */
  isProductFavourite: (productId) => {
    const { favourites } = get();
    return favourites.some((item) => item.id === productId);
  },

  /**
   * Clears all items from the favourites list. This also removes the favourites
   * data from `localStorage`.
   * @returns {void}
   */
  clearFavourites: () =>
    set(() => {
      localStorage.removeItem("myFakeStoreFavourites");
      return { favourites: [] };
    }),
}));

export default useFavouritesStore;
