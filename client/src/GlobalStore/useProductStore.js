// stores/useProductsStore.js
import { create } from "zustand";

/**
 * Zustand store for managing product data, including fetching, filtering, and sorting.
 * @typedef {Object} ProductStore
 * @property {Array<object>} storeItems - The raw list of all products fetched from the API.
 * @property {object} productInfo - Detailed information for a single product, typically used for a product detail page.
 * @property {Array<object>} filteredItems - The list of products after applying current filters and sorting.
 * @property {boolean} loading - True if data is currently being fetched, false otherwise.
 * @property {string|null} error - Any error message encountered during data fetching, or null if no error.
 * @property {Array<string>} categories - A list of unique product categories available in the store items.
 * @property {string} categoryOption - The currently selected category filter option.
 * @property {string} sortOption - The currently selected sort order option (e.g., "A-Z", "Lowest").
 * @property {function(boolean): void} setLoading - Sets the loading state.
 * @property {function(string|null): void} setError - Sets the error message.
 * @property {function(string): void} setCategoryOption - Sets the category filter and reapplies filters/sort.
 * @property {function(string): void} setSortOption - Sets the sort option and reapplies filters/sort.
 * @property {function(): Promise<void>} fetchStoreData - Fetches all product data from the Fake Store API.
 * @property {function(number): Promise<void>} fetchProductInfo - Fetches detailed information for a single product by its ID.
 * @property {function(): void} extractAndSetCategories - Extracts unique categories from `storeItems` and updates the `categories` state.
 * @property {function(): void} applyFiltersAndSort - Applies the current `categoryOption` and `sortOption` to `storeItems` to update `filteredItems`.
 */
const useProductsStore = create((set, get) => ({
  /**
   * The raw list of all products fetched from the API.
   * @type {Array<object>}
   */
  storeItems: [],

  /**
   * Detailed information for a single product, typically used for a product detail page.
   * @type {object}
   */
  productInfo: {},

  /**
   * The list of products after applying current filters and sorting.
   * This array is what should be rendered in product listings.
   * @type {Array<object>}
   */
  filteredItems: [],

  /**
   * Indicates if data is currently being fetched from the API.
   * @type {boolean}
   */
  loading: false,

  /**
   * Stores any error message encountered during API calls.
   * @type {string|null}
   */
  error: null,

  /**
   * A list of unique product categories available in the `storeItems`.
   * @type {Array<string>}
   */
  categories: [],

  /**
   * The currently selected category filter option. An empty string or "none" means no category filter.
   * @type {string}
   */
  categoryOption: "",

  /**
   * The currently selected sort order option (e.g., "A-Z", "Lowest", "Highest", "none").
   * @type {string}
   */
  sortOption: "",

  /**
   * Sets the loading state of the store.
   * @param {boolean} isLoading - True if loading, false otherwise.
   */
  setLoading: (isLoading) => set({ loading: isLoading }),

  /**
   * Sets the error message state of the store.
   * @param {string|null} error - The error message string, or null to clear.
   */
  setError: (error) => set({ error: error }),

  /**
   * Sets the selected category filter option and then immediately applies
   * the filters and sorting to update `filteredItems`.
   * @param {string} option - The category string to filter by.
   */
  setCategoryOption: (option) => {
    set({ categoryOption: option });
    get().applyFiltersAndSort();
  },

  /**
   * Sets the selected sort option and then immediately applies
   * the filters and sorting to update `filteredItems`.
   * @param {string} option - The sort string (e.g., "A-Z", "Lowest").
   */
  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFiltersAndSort();
  },

  /**
   * Fetches all product data from the Fake Store API.
   * Sets `loading` to true during the fetch and handles success or error states.
   * After fetching, it extracts categories and applies initial filters/sorting.
   * @async
   * @returns {Promise<void>} A promise that resolves when the data is fetched and processed.
   */
  fetchStoreData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      set({ storeItems: data, loading: false });
      get().extractAndSetCategories();
      get().applyFiltersAndSort(); // Apply initial filters/sort after data fetch
    } catch (error) {
      console.error("An error occurred fetching store data:", error);
      set({ error: "Failed to load store data", loading: false });
    }
  },

  /**
   * Fetches detailed information for a single product by its ID from the Fake Store API.
   * Sets `loading` to true during the fetch and handles success or error states.
   * @async
   * @param {number} id - The ID of the product to fetch.
   * @returns {Promise<void>} A promise that resolves when the product info is fetched.
   */
  fetchProductInfo: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      set({ productInfo: data, loading: false });
    } catch (error) {
      console.error("An error occurred fetching product info:", error);
      set({ error: "Failed to load product data", loading: false });
    }
  },

  /**
   * Extracts unique categories from the `storeItems` array and updates the `categories` state.
   * This should be called after `storeItems` has been populated.
   */
  extractAndSetCategories: () => {
    const { storeItems } = get();
    if (!storeItems || storeItems.length === 0) {
      set({ categories: [] });
      return;
    }
    const uniqueCategories = new Set(storeItems.map((item) => item.category).filter(Boolean));
    set({ categories: Array.from(uniqueCategories) });
  },

  /**
   * Applies the current `categoryOption` filter and `sortOption` order
   * to the `storeItems` and updates the `filteredItems` state.
   * This function is called whenever `categoryOption` or `sortOption` changes,
   * or after `storeItems` are initially fetched.
   */
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
      default:
        // No specific sort, maintain original order or default if applicable
        break;
    }

    set({ filteredItems: currentFilteredItems });
  },
}));

export default useProductsStore;
