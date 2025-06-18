import { create } from "zustand";
import { db } from "../firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

/**
 * Zustand store for managing the user's shopping cart.
 * Handles adding, removing, and clearing items from the cart,
 * and synchronizes the cart with both local storage and Firestore
 * depending on the user's login status.
 * @typedef {Object} CartStore
 * @property {Array<object>} cart - An array of cart items, each with product details and quantity.
 * @property {function(): void|null} cartUnsubscribe - The unsubscribe function for the Firestore real-time listener, or null.
 * @property {function(Array<object>): object} cartArrayToMap - Helper to convert cart array to Firestore-friendly map.
 * @property {function(object): Array<object>} cartMapToArray - Helper to convert Firestore cart map to array for Zustand state.
 * @property {function(string, Array<object>): Promise<void>} updateCartInFirestore - Updates the user's cart in Firestore.
 * @property {function(string): Promise<void>} mergeCarts - Merges items from local storage cart into the Firestore cart upon login.
 * @property {function(string): void} subscribeToUserCart - Subscribes to real-time updates for the user's cart in Firestore.
 * @property {function(): void} unsubscribeFromCart - Unsubscribes from the Firestore cart real-time listener.
 * @property {function(object): void} addToCart - Adds an item to the cart.
 * @property {function(number): void} removeFromCart - Removes an item (or decreases its quantity) from the cart.
 * @property {function(): void} clearCart - Clears the local storage cart and the Zustand cart state, and optionally Firestore cart.
 * @property {function(): void} setGuestCartFromLocalStorage - Initializes the cart state from local storage for guest users.
 */
const useCartStore = create((set, get) => ({
  /**
   * The current state of the shopping cart. Initialized from local storage.
   * @type {Array<object>}
   */
  cart: JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]"),

  /**
   * Stores the unsubscribe function for the Firestore real-time listener.
   * This allows the listener to be cleaned up when no longer needed (e.g., on logout).
   * @type {function(): void|null}
   * @private
   */
  cartUnsubscribe: null,

  /**
   * Helper function to convert a cart array (Zustand format) into a map
   * where keys are product IDs and values are item objects. This format is
   * more suitable for storing in Firestore to avoid issues with array merges.
   * @param {Array<object>} cartArray - The cart array from Zustand state.
   * @returns {object} A map of cart items by product ID. Each item in the map
   * will also have a `productId` field matching its key.
   * @private
   */
  cartArrayToMap: (cartArray) => {
    return cartArray.reduce((acc, item) => {
      acc[item.id] = { ...item, productId: item.id }; // Add productId field and spread other item details
      return acc;
    }, {});
  },

  /**
   * Helper function to convert a Firestore cart map back into a cart array
   * (Zustand format). This is used when reading data from Firestore.
   * @param {object} cartMap - The cart map from a Firestore document.
   * @returns {Array<object>} An array of cart items. Each item will have an `id` field.
   * @private
   */
  cartMapToArray: (cartMap) => {
    if (!cartMap) return [];
    return Object.values(cartMap).map((item) => ({ ...item, id: item.productId })); // Ensure 'id' is present
  },

  /**
   * Updates the user's cart in Firestore. This function is called internally
   * when the cart state changes and the user is logged in.
   * @param {string} userId - The UID of the user whose cart is being updated.
   * @param {Array<object>} cartItemsArray - The cart items as an array to be saved to Firestore.
   * @private
   */
  updateCartInFirestore: async (userId, cartItemsArray) => {
    const cartRef = doc(db, "carts", userId);
    const cartItemsMap = get().cartArrayToMap(cartItemsArray);
    try {
      // Use setDoc with merge:true to create or update the document without overwriting other fields
      await setDoc(cartRef, { items: cartItemsMap, lastUpdated: new Date() }, { merge: true });
      console.log("Cart updated successfully in Firestore!");
    } catch (error) {
      console.error("Error updating cart in Firestore: ", error);
    }
  },

  /**
   * Merges items from the local storage cart into the Firestore cart upon user login.
   * This ensures that any items added as a guest are transferred to the user's persistent cart.
   * @param {string} userId - The UID of the logged-in user.
   * @private
   */
  mergeCarts: async (userId) => {
    const localStorageCart = JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]");
    if (localStorageCart.length === 0) {
      console.log("No local storage cart to merge.");
      return; // Nothing to merge
    }

    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);
    let firestoreCartMap = {}; // Will store Firestore cart as a map for easy merging

    if (cartSnap.exists()) {
      firestoreCartMap = cartSnap.data().items || {};
    }

    // Merge local storage items into the Firestore map
    localStorageCart.forEach((localItem) => {
      if (firestoreCartMap[localItem.id]) {
        // Item exists in both, update quantity
        firestoreCartMap[localItem.id].quantity += localItem.quantity;
      } else {
        // Item only in local storage, add it to the map
        firestoreCartMap[localItem.id] = { ...localItem, productId: localItem.id };
      }
    });

    // Convert the merged map back to an array for _updateCartInFirestore
    const mergedCartArray = get().cartMapToArray(firestoreCartMap);
    await get().updateCartInFirestore(userId, mergedCartArray);
    localStorage.removeItem("myFakeStoreCart"); // Clear local storage after merge
    console.log("Carts merged successfully!");
  },

  /**
   * Subscribes to real-time updates for the user's cart in Firestore.
   * When the Firestore cart changes, the local Zustand cart state is updated.
   * This ensures the UI reflects the most current cart data.
   * @param {string} userId - The UID of the user.
   * @private
   */
  subscribeToUserCart: (userId) => {
    // Unsubscribe from any previous listener to avoid memory leaks
    if (get().cartUnsubscribe) {
      get().cartUnsubscribe();
    }

    const cartRef = doc(db, "carts", userId);
    const unsubscribe = onSnapshot(
      cartRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const firestoreCartMap = docSnap.data().items || {};
          const newCartArray = get().cartMapToArray(firestoreCartMap);
          set({ cart: newCartArray });
          console.log("Real-time cart updated from Firestore:", newCartArray);
        } else {
          // Document does not exist (e.g., first login, or cart was cleared)
          set({ cart: [] });
          console.log("Cart document not found in Firestore. Setting local cart to empty.");
        }
      },
      (error) => {
        console.error("Error listening to cart changes from Firestore: ", error);
        // Optionally handle error, e.g., revert to local storage or show message
      }
    );

    set({ cartUnsubscribe: unsubscribe }); // Store the unsubscribe function
  },

  /**
   * Unsubscribes from the Firestore real-time cart listener.
   * This should be called when the user logs out or the component unmounts
   * to prevent memory leaks and unnecessary data fetching.
   * @private
   */
  unsubscribeFromCart: () => {
    if (get().cartUnsubscribe) {
      get().cartUnsubscribe();
      set({ cartUnsubscribe: null });
      console.log("Unsubscribed from Firestore cart listener.");
    }
  },

  /**
   * Adds a product item to the cart. If the item already exists in the cart,
   * its quantity is incremented. Otherwise, the item is added with a quantity of 1.
   * The cart is then persisted to Firestore (if logged in) or local storage (if not logged in).
   * @param {object} itemToAdd - The product item object to add to the cart. Must have an `id` property.
   */
  addToCart: (itemToAdd) =>
    set((state) => {
      const { user, isLoggedIn } = get(); // Get latest user state within set
      const newCart = [...state.cart];
      const existingProductIndex = newCart.findIndex((item) => item.id === itemToAdd.id);

      if (existingProductIndex > -1) {
        // Item already in cart, increment quantity
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: newCart[existingProductIndex].quantity + 1,
        };
      } else {
        // New item, add to cart with quantity 1
        newCart.push({ ...itemToAdd, quantity: 1 });
      }

      // If logged in, update Firestore. The _subscribeToUserCart will then update the local state.
      if (isLoggedIn && user && user.uid) {
        get().updateCartInFirestore(user.uid, newCart);
      } else {
        // If not logged in, update localStorage
        localStorage.setItem("myFakeStoreCart", JSON.stringify(newCart));
      }
      return { cart: newCart };
    }),

  /**
   * Removes a product item from the cart. If the item's quantity is greater than 1,
   * its quantity is decremented. If the quantity is 1, the item is completely removed from the cart.
   * The cart is then persisted to Firestore (if logged in) or local storage (if not logged in).
   * @param {number} itemId - The ID of the item to remove or decrease quantity for.
   */
  removeFromCart: (itemId) =>
    set((state) => {
      const { user, isLoggedIn } = get(); // Get latest user state within set
      const newCart = [...state.cart];
      const existingProductIndex = newCart.findIndex((item) => item.id === itemId);

      if (existingProductIndex > -1) {
        if (newCart[existingProductIndex].quantity > 1) {
          // Decrease quantity
          newCart[existingProductIndex] = {
            ...newCart[existingProductIndex],
            quantity: newCart[existingProductIndex].quantity - 1,
          };
        } else {
          // Quantity is 1, remove item
          newCart.splice(existingProductIndex, 1);
        }
      } else {
        console.warn(`Attempted to remove item ID ${itemId}, but it was not found in the cart.`);
      }

      // If logged in, update Firestore. The _subscribeToUserCart will then update the local state.
      if (isLoggedIn && user && user.uid) {
        get().updateCartInFirestore(user.uid, newCart);
      } else {
        // If not logged in, update localStorage
        localStorage.setItem("myFakeStoreCart", JSON.stringify(newCart));
      }

      return { cart: newCart };
    }),

  /**
   * Clears all items from the cart.
   * If the user is logged in, their Firestore cart will also be cleared.
   * Otherwise, the local storage cart will be cleared.
   */
  clearCart: () =>
    set((state) => {
      const { user, isLoggedIn } = get();
      if (isLoggedIn && user && user.uid) {
        get().updateCartInFirestore(user.uid, []); // Set Firestore cart to empty array
      } else {
        localStorage.removeItem("myFakeStoreCart");
      }
      return { cart: [] };
    }),

  /**
   * Initializes the cart state by loading the cart items from local storage.
   * This is primarily used for guest users to retrieve their previously saved cart.
   */
  setGuestCartFromLocalStorage: () => {
    const guestCart = JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]");
    set({ cart: guestCart });
  },
}));

export default useCartStore;
