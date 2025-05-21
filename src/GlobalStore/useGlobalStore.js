import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  storeItems: [],
  loading: false,
  error: null,
  categories: [],

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
    } catch (error) {
      console.error("An error occurred:", error);
      set({ error: "Failed to load store data", loading: false });
    }
  },

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
}));

export default useGlobalStore;
