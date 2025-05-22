import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  storeItems: [],
  productInfo: {},
  loading: false,
  error: null,
  categories: [],
  categoryOption: "",
  sortOption: "",
  filteredItems: [],

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

  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFiltersAndSort();
  },

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
}));

export default useGlobalStore;
