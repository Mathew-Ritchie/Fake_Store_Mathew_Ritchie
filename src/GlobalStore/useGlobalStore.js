import { create } from "zustand";
import AddToCartBtn from "../Components/buttons/AddToCartBtn";

const useGlobalStore = create((set, get) => ({
  storeItems: [],
  productInfo: {},
  loading: false,
  error: null,
  categories: [],
  categoryOption: "",
  sortOption: "",
  filteredItems: [],
  cart: JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]"),
  favourites: JSON.parse(localStorage.getItem("myFakeStoreFavourites") || "[]"),

  //Fetch the store items from the API and store them in StoreItems.
  fetchStoreData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await res.json();
      set({ storeItems: data, loading: false });
      get().extractAndSetCategories();
      get().applyFiltersAndSort();
    } catch (error) {
      console.error("An error occurred:", error);
      set({ error: "Failed to load store data", loading: false });
    }
  },

  //Fetch Specific products data from API based on ID
  fetchProductInfo: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await res.json();
      set({ productInfo: data, loading: false });
    } catch (error) {
      console.error("An error occurred:", error);
      set({ error: "Failed to load store data", loading: false });
    }
  },

  //Extract categories from the storeItems and add them to categories store.
  extractAndSetCategories: () => {
    const { storeItems } = get();
    if (!storeItems || storeItems.length === 0) {
      set({ categories: [] });
      return;
    }
    const uniqueCategories = new Set();
    storeItems.forEach((item) => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    set({ categories: Array.from(uniqueCategories) });
  },

  //Set categoryOption to changed category
  setCategoryOption: (option) => {
    set({ categoryOption: option });
    get().applyFiltersAndSort();
  },

  //Set sortOption to changed category
  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFiltersAndSort();
  },

  //function to filter by category and sort based on sort case.
  applyFiltersAndSort: () => {
    const { storeItems, categoryOption, sortOption } = get();
    let currentFilteredItems = [...storeItems];
    if (categoryOption && categoryOption !== "") {
      currentFilteredItems = currentFilteredItems.filter(
        (item) => item.category === categoryOption
      );
    }

    switch (sortOption) {
      case "A-Z":
        currentFilteredItems.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        currentFilteredItems.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Lowest":
        currentFilteredItems.sort((a, b) => a.price - b.price);
        break;
      case "Highest":
        currentFilteredItems.sort((a, b) => b.price - a.price);
        break;
      case "none":
        break;
    }

    set({ filteredItems: currentFilteredItems });
  },

  addToCart: (itemToAdd) =>
    set((state) => {
      const newCart = [...state.cart];
      const existingProductIndex = newCart.findIndex((item) => item.id === itemToAdd.id);
      if (existingProductIndex > -1) {
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: newCart[existingProductIndex].quantity + 1,
        };
      } else {
        newCart.push({ ...itemToAdd, quantity: 1 });
      }

      localStorage.setItem("myFakeStoreCart", JSON.stringify(newCart));
      return { cart: newCart };
    }),

  removeFromCart: (itemId) =>
    set((state) => {
      const newCart = [...state.cart];
      const existingProductIndex = newCart.findIndex((item) => item.id === itemId);
      if (existingProductIndex > -1) {
        if (newCart[existingProductIndex].quantity > 1) {
          newCart[existingProductIndex] = {
            ...newCart[existingProductIndex],
            quantity: newCart[existingProductIndex].quantity - 1,
          };
          console.log(
            `Decreased quantity of item ID ${itemId} to ${newCart[existingProductIndex].quantity}`
          );
        } else {
          const removedItemTitle = newCart[existingProductIndex].title;
          newCart.splice(existingProductIndex, 1);
          console.log(`Removed ${removedItemTitle} (ID: ${itemId}) from cart`);
        }
      } else {
        console.warn(`Attempted to remove item ID ${itemId}, but it was not found in the cart.`);
      }

      localStorage.setItem("myFakeStoreCart", JSON.stringify(newCart));

      return { cart: newCart };
    }),

  // clearCart: () =>
  //   set(() => {
  //     localStorage.removeItem("myFakeStoreCart");
  //     return { cart: [] };
  //   }),

  toggleFavourite: (productToToggle) =>
    set((state) => {
      if (!productToToggle || typeof productToToggle.id === "undefined") {
        console.warn("toggleFavourite: Invalid product provided (missing ID).", productToToggle);
        return {};
      }

      const newFavourites = [...state.favourites];

      const existingFavouriteIndex = newFavourites.findIndex(
        (favItem) => favItem.id === productToToggle.id
      );

      // Logic to add or remove
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
   * Checks if a product is currently in the favourites list.
   * This is a "getter" action that doesn't modify state, but uses 'get()'.
   * @param {number} productId - The ID of the product to check.
   * @returns {boolean} True if the product is a favourite, false otherwise.
   */
  isProductFavourite: (productId) => {
    const { favourites } = get();
    return favourites.some((item) => item.id === productId);
  },

  clearFavourites: () =>
    set(() => {
      localStorage.removeItem("myFakeStoreFavourites");
      return { favourites: [] };
    }),
}));

export default useGlobalStore;
