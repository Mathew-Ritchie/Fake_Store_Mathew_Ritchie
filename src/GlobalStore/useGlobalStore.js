// import { create } from "zustand";
// import { auth, db } from "../firebase";
// import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// const useGlobalStore = create((set, get) => ({
//   storeItems: [],
//   productInfo: {},
//   filteredItems: [],

//   loading: false,
//   error: null,

//   categories: [],
//   categoryOption: "",
//   sortOption: "",

//   cart: JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]"),
//   favourites: JSON.parse(localStorage.getItem("myFakeStoreFavourites") || "[]"),

//   user: null,
//   isLoggedIn: false,
//   authLoading: false,
//   authError: null,

//   _cartUnsubscribe: null,

//   setAuthLoading: (isLoading) => set({ authLoading: isLoading }),

//   fetchUserProfileFromFirestore: async (uid) => {
//     if (!uid) return null;
//     const userDocRef = doc(db, "users", uid);
//     try {
//       const userDocSnap = await getDoc(userDocRef);
//       if (userDocSnap.exists()) {
//         return userDocSnap.data();
//       } else {
//         console.warn("No additional user data found in Firestore for UID:", uid);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching user data from Firestore for UID:", uid, error);
//       return null;
//     }
//   },
//   //Set user and update isLoggedIn state
//   setUser: (userData) => {
//     set({ user: userData, isLoggedIn: !!userData });
//     // localStorage.setItem("currentUser", JSON.stringify(userData));
//   },

//   //Login
//   loginUser: async (email, password) => {
//     set({ authLoading: true, authError: null });
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const firebaseAuthUser = userCredential.user;

//       const customUserProfile = await get().fetchUserProfileFromFirestore(firebaseAuthUser.uid);
//       const combinedUserData = {
//         uid: firebaseAuthUser.uid,
//         email: firebaseAuthUser.email,
//         displayName: firebaseAuthUser.displayName,
//         photoURL: firebaseAuthUser.photoURL,
//         username: customUserProfile ? customUserProfile.username : null,
//         createdAt: customUserProfile ? customUserProfile.createdAt : null,
//       };

//       set({
//         user: combinedUserData,
//         isLoggedIn: true,
//         authLoading: false,
//       });

//       // Merge local cart with Firestore cart (if any)
//       await get()._mergeCarts(firebaseAuthUser.uid);
//       // Subscribe to real-time cart updates from Firestore
//       get()._subscribeToUserCart(firebaseAuthUser.uid);
//       // Clear localStorage cart after successful merge
//       localStorage.removeItem("myFakeStoreCart");

//       return combinedUserData;
//     } catch (error) {
//       console.error("Auth Error (from store):", error.message);
//       set({ authError: error.message, authLoading: false, user: null, isLoggedIn: false });
//       throw error;
//     }
//   },

//   logoutUser: async () => {
//     set({ authLoading: true, authError: null });
//     try {
//       await signOut(auth);
//       get()._unsubscribeFromCart();
//       set({ user: null, isLoggedIn: false, authLoading: false, cart: [] });
//     } catch (error) {
//       console.error("Logout Error (from store):", error.message);
//       set({ authError: error.message, authLoading: false });
//       throw error;
//     }
//   },

//   /**
//    * Helper to convert cart array to Firestore-friendly map.
//    * @param {Array} cartArray - The cart array from Zustand state.
//    * @returns {object} A map of cart items by product ID.
//    */
//   _cartArrayToMap: (cartArray) => {
//     return cartArray.reduce((acc, item) => {
//       acc[item.id] = { ...item, productId: item.id }; // Add productId field and spread other item details
//       return acc;
//     }, {});
//   },

//   /**
//    * Helper to convert Firestore cart map to array for Zustand state.
//    * @param {object} cartMap - The cart map from Firestore document.
//    * @returns {Array} An array of cart items.
//    */
//   _cartMapToArray: (cartMap) => {
//     if (!cartMap) return [];
//     return Object.values(cartMap).map((item) => ({ ...item, id: item.productId })); // Ensure 'id' is present
//   },

//   /**
//    * Updates the user's cart in Firestore.
//    * @param {string} userId - The UID of the user.
//    * @param {Array} cartItemsArray - The cart items as an array.
//    */
//   _updateCartInFirestore: async (userId, cartItemsArray) => {
//     const cartRef = doc(db, "carts", userId);
//     const cartItemsMap = get()._cartArrayToMap(cartItemsArray);
//     try {
//       // Use setDoc with merge:true to create or update the document without overwriting other fields
//       await setDoc(cartRef, { items: cartItemsMap, lastUpdated: new Date() }, { merge: true });
//       console.log("Cart updated successfully in Firestore!");
//     } catch (error) {
//       console.error("Error updating cart in Firestore: ", error);
//     }
//   },

//   /**
//    * Merges items from local storage cart into the Firestore cart upon login.
//    * @param {string} userId - The UID of the logged-in user.
//    */
//   _mergeCarts: async (userId) => {
//     const localStorageCart = JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]");
//     if (localStorageCart.length === 0) {
//       console.log("No local storage cart to merge.");
//       return; // Nothing to merge
//     }

//     const cartRef = doc(db, "carts", userId);
//     const cartSnap = await getDoc(cartRef);
//     let firestoreCartMap = {}; // Will store Firestore cart as a map for easy merging

//     if (cartSnap.exists()) {
//       firestoreCartMap = cartSnap.data().items || {};
//     }

//     // Merge local storage items into the Firestore map
//     localStorageCart.forEach((localItem) => {
//       if (firestoreCartMap[localItem.id]) {
//         // Item exists in both, update quantity
//         firestoreCartMap[localItem.id].quantity += localItem.quantity;
//       } else {
//         // Item only in local storage, add it to the map
//         firestoreCartMap[localItem.id] = { ...localItem, productId: localItem.id };
//       }
//     });

//     // Convert the merged map back to an array for _updateCartInFirestore
//     const mergedCartArray = get()._cartMapToArray(firestoreCartMap);
//     await get()._updateCartInFirestore(userId, mergedCartArray);
//     localStorage.removeItem("myFakeStoreCart"); // Clear local storage after merge
//     console.log("Carts merged successfully!");
//   },

//   /**
//    * Subscribes to real-time updates for the user's cart in Firestore.
//    * @param {string} userId - The UID of the user.
//    */
//   _subscribeToUserCart: (userId) => {
//     // Unsubscribe from any previous listener to avoid memory leaks
//     if (get()._cartUnsubscribe) {
//       get()._cartUnsubscribe();
//     }

//     const cartRef = doc(db, "carts", userId);
//     const unsubscribe = onSnapshot(
//       cartRef,
//       (docSnap) => {
//         if (docSnap.exists()) {
//           const firestoreCartMap = docSnap.data().items || {};
//           const newCartArray = get()._cartMapToArray(firestoreCartMap);
//           set({ cart: newCartArray });
//           console.log("Real-time cart updated from Firestore:", newCartArray);
//         } else {
//           // Document does not exist (e.g., first login, or cart was cleared)
//           set({ cart: [] });
//           console.log("Cart document not found in Firestore. Setting local cart to empty.");
//         }
//       },
//       (error) => {
//         console.error("Error listening to cart changes from Firestore: ", error);
//         // Optionally handle error, e.g., revert to local storage or show message
//       }
//     );

//     set({ _cartUnsubscribe: unsubscribe }); // Store the unsubscribe function
//   },

//   _unsubscribeFromCart: () => {
//     if (get()._cartUnsubscribe) {
//       get()._cartUnsubscribe();
//       set({ _cartUnsubscribe: null });
//       console.log("Unsubscribed from Firestore cart listener.");
//     }
//   },

//   /**
//    * Adds an item to the cart. Persists to Firestore if logged in, otherwise to localStorage.
//    * @param {object} itemToAdd - The product item to add.
//    */
//   addToCart: (itemToAdd) =>
//     set((state) => {
//       const { user, isLoggedIn } = get(); // Get latest user state within set
//       const newCart = [...state.cart];
//       const existingProductIndex = newCart.findIndex((item) => item.id === itemToAdd.id);

//       if (existingProductIndex > -1) {
//         // Item already in cart, increment quantity
//         newCart[existingProductIndex] = {
//           ...newCart[existingProductIndex],
//           quantity: newCart[existingProductIndex].quantity + 1,
//         };
//       } else {
//         // New item, add to cart with quantity 1
//         newCart.push({ ...itemToAdd, quantity: 1 });
//       }

//       // If logged in, update Firestore. The _subscribeToUserCart will then update the local state.
//       if (isLoggedIn && user && user.uid) {
//         get()._updateCartInFirestore(user.uid, newCart);
//       } else {
//         // If not logged in, update localStorage
//         localStorage.setItem("myFakeStoreCart", JSON.stringify(newCart));
//       }
//       return { cart: newCart };
//     }),

//   /**
//    * Removes an item (or decreases its quantity) from the cart.
//    * Persists to Firestore if logged in, otherwise to localStorage.
//    * @param {number} itemId - The ID of the item to remove.
//    */
//   removeFromCart: (itemId) =>
//     set((state) => {
//       const { user, isLoggedIn } = get(); // Get latest user state within set
//       const newCart = [...state.cart];
//       const existingProductIndex = newCart.findIndex((item) => item.id === itemId);

//       if (existingProductIndex > -1) {
//         if (newCart[existingProductIndex].quantity > 1) {
//           // Decrease quantity
//           newCart[existingProductIndex] = {
//             ...newCart[existingProductIndex],
//             quantity: newCart[existingProductIndex].quantity - 1,
//           };
//         } else {
//           // Quantity is 1, remove item
//           newCart.splice(existingProductIndex, 1);
//         }
//       } else {
//         console.warn(`Attempted to remove item ID ${itemId}, but it was not found in the cart.`);
//       }

//       // If logged in, update Firestore. The _subscribeToUserCart will then update the local state.
//       if (isLoggedIn && user && user.uid) {
//         get()._updateCartInFirestore(user.uid, newCart);
//       } else {
//         // If not logged in, update localStorage
//         localStorage.setItem("myFakeStoreCart", JSON.stringify(newCart));
//       }

//       return { cart: newCart };
//     }),

//   /**
//    * Clears the local storage cart and the Zustand cart state.
//    * Note: For logged-in users, this would typically involve setting their Firestore cart to empty.
//    * This current implementation only clears localStorage.
//    */
//   clearCart: () =>
//     set((state) => {
//       const { user, isLoggedIn } = get();
//       if (isLoggedIn && user && user.uid) {
//         get()._updateCartInFirestore(user.uid, []); // Set Firestore cart to empty array
//       } else {
//         localStorage.removeItem("myFakeStoreCart");
//       }
//       return { cart: [] };
//     }),

//   //Fetch the store items from the API and store them in StoreItems.
//   fetchStoreData: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch("https://fakestoreapi.com/products");
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await res.json();
//       set({ storeItems: data, loading: false });
//       get().extractAndSetCategories();
//       get().applyFiltersAndSort();
//     } catch (error) {
//       console.error("An error occurred:", error);
//       set({ error: "Failed to load store data", loading: false });
//     }
//   },

//   //Fetch Specific products data from API based on ID
//   fetchProductInfo: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(`https://fakestoreapi.com/products/${id}`);
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await res.json();
//       set({ productInfo: data, loading: false });
//     } catch (error) {
//       console.error("An error occurred:", error);
//       set({ error: "Failed to load store data", loading: false });
//     }
//   },

//   //Extract categories from the storeItems and add them to categories store.
//   extractAndSetCategories: () => {
//     const { storeItems } = get();
//     if (!storeItems || storeItems.length === 0) {
//       set({ categories: [] });
//       return;
//     }
//     const uniqueCategories = new Set();
//     storeItems.forEach((item) => {
//       if (item.category) {
//         uniqueCategories.add(item.category);
//       }
//     });
//     set({ categories: Array.from(uniqueCategories) });
//   },

//   //Set categoryOption to changed category
//   setCategoryOption: (option) => {
//     set({ categoryOption: option });
//     get().applyFiltersAndSort();
//   },

//   //Set sortOption to changed category
//   setSortOption: (option) => {
//     set({ sortOption: option });
//     get().applyFiltersAndSort();
//   },

//   //function to filter by category and sort based on sort case.
//   applyFiltersAndSort: () => {
//     const { storeItems, categoryOption, sortOption } = get();
//     let currentFilteredItems = [...storeItems];
//     if (categoryOption && categoryOption !== "") {
//       currentFilteredItems = currentFilteredItems.filter(
//         (item) => item.category === categoryOption
//       );
//     }

//     switch (sortOption) {
//       case "A-Z":
//         currentFilteredItems.sort((a, b) => a.title.localeCompare(b.title));
//         break;
//       case "Z-A":
//         currentFilteredItems.sort((a, b) => b.title.localeCompare(a.title));
//         break;
//       case "Lowest":
//         currentFilteredItems.sort((a, b) => a.price - b.price);
//         break;
//       case "Highest":
//         currentFilteredItems.sort((a, b) => b.price - a.price);
//         break;
//       case "none":
//         break;
//     }

//     set({ filteredItems: currentFilteredItems });
//   },

//   toggleFavourite: (productToToggle) =>
//     set((state) => {
//       if (!productToToggle || typeof productToToggle.id === "undefined") {
//         console.warn("toggleFavourite: Invalid product provided (missing ID).", productToToggle);
//         return {};
//       }

//       const newFavourites = [...state.favourites];

//       const existingFavouriteIndex = newFavourites.findIndex(
//         (favItem) => favItem.id === productToToggle.id
//       );

//       // Logic to add or remove
//       if (existingFavouriteIndex !== -1) {
//         newFavourites.splice(existingFavouriteIndex, 1);
//         console.log(`${productToToggle.title || "An item"} removed from favourites.`);
//       } else {
//         newFavourites.push({ ...productToToggle });
//         console.log(`${productToToggle.title || "An item"} added to favourites.`);
//       }

//       localStorage.setItem("myFakeStoreFavourites", JSON.stringify(newFavourites));

//       return { favourites: newFavourites };
//     }),

//   /**
//    * Checks if a product is currently in the favourites list.
//    * This is a "getter" action that doesn't modify state, but uses 'get()'.
//    * @param {number} productId - The ID of the product to check.
//    * @returns {boolean} True if the product is a favourite, false otherwise.
//    */
//   isProductFavourite: (productId) => {
//     const { favourites } = get();
//     return favourites.some((item) => item.id === productId);
//   },

//   clearFavourites: () =>
//     set(() => {
//       localStorage.removeItem("myFakeStoreFavourites");
//       return { favourites: [] };
//     }),

//   // --- Initialization for Firebase Auth State and Cart Listener ---
//   // This should be called once, typically in your main App component's useEffect
//   initializeFirebaseAndCartListeners: () => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         console.log("Firebase Auth State Changed: User logged in.", user.uid);
//         // Fetch custom profile and set user in store
//         const customUserProfile = await get().fetchUserProfileFromFirestore(user.uid);
//         const combinedUserData = {
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//           photoURL: user.photoURL,
//           username: customUserProfile ? customUserProfile.username : null,
//           createdAt: customUserProfile ? customUserProfile.createdAt : null,
//         };
//         set({ user: combinedUserData, isLoggedIn: true });

//         // If the user logs in via onAuthStateChanged (e.g., on app refresh),
//         // we need to perform the merge and subscribe logic here.
//         // The `loginUser` action already handles this for direct logins.
//         // This handles cases where the session persists or a refresh occurs.
//         await get()._mergeCarts(user.uid);
//         get()._subscribeToUserCart(user.uid);
//         localStorage.removeItem("myFakeStoreCart"); // Clear local storage after merge
//       } else {
//         console.log("Firebase Auth State Changed: User logged out or no user.");
//         // Clear user from store
//         set({ user: null, isLoggedIn: false });
//         // Unsubscribe from Firestore cart listener
//         get()._unsubscribeFromCart();
//         // If a user logs out, their local cart should remain for guest mode,
//         // unless you specifically want to clear it.
//         // Here, we load from localStorage for guest mode.
//         const guestCart = JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]");
//         set({ cart: guestCart });
//       }
//       set({ authLoading: false }); // Auth check complete
//     });
//   },
// }));

// export default useGlobalStore;
