import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  storeItems: [],
  loading: false,
  error: null,
  categories: [],
  categoryOption: "",
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
      get().applyFilters();
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
    get().applyFilters();
  },

  applyFilters: () => {
    const { storeItems, categoryOption } = get();
    let currentFilteredItems = [...storeItems];
    if (categoryOption && categoryOption !== "") {
      currentFilteredItems = currentFilteredItems.filter(
        (item) => item.category === categoryOption
      );
    }
    set({ filteredItems: currentFilteredItems });
  },
}));

export default useGlobalStore;
