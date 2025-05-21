import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  storeItems: [],
  loading: false,
  error: null,

  fetchStoreData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await res.json();
      set({ storeItems: data });
      set({ loading: false });
    } catch (error) {
      console.error("An error occurred:", error);
      set({ error: "Failed to load store data", loading: false });
    }
  },
}));

export default useGlobalStore;
