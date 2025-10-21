import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

//importing new zustand stores. favourites is not currently needed here as it is not connected to firebase.
import useAuthStore from "./GlobalStore/useAuthStore";
import useCartStore from "./GlobalStore/useCartStore";
import useProductsStore from "./GlobalStore/useProductStore";
//import useFavouritesStore from "./GlobalStore/useFavouritesStore"; //Not currently needed as this still works on Localstorage
// import useGlobalStore from "./GlobalStore/useGlobalStore";

//Import glabal CSS
import "./app.css";

//Import individual page components
import ProductPage from "./Pages/ProductPage";
import MainPage from "./Pages/MainPage";
import MainHeader from "./Components/Headers_and_Footers/MainHeader";
import FavouritesPage from "./Pages/FavouritesPage";
import CartPage from "./Pages/CartPage";
import Login from "./credentialCertification/LogIn";
import Register from "./credentialCertification/Register";

/**
 * @typedef {object} UserProfile
 * @property {string} uid - The user's unique ID from Firebase Auth.
 * @property {string | null} email - The user's email address.
 * @property {string | null} displayName - The user's display name.
 * @property {string | null} photoURL - The user's photo URL.
 * @property {string | null} username - Custom username from Firestore profile.
 * @property {string | null} createdAt - Timestamp of user creation from Firestore profile.
 */

/**
 * Main application component.
 * Sets up routing, initializes Firebase authentication listeners,
 * and fetches initial store data.
 * @returns {JSX.Element} The root React component for the application.
 */
export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const fetchUserProfileFromFirestore = useAuthStore(
    (state) => state.fetchUserProfileFromFirestore
  );

  const mergeCarts = useCartStore((state) => state.mergeCarts);
  const subscribeToUserCart = useCartStore((state) => state.subscribeToUserCart);
  const unsubscribeFromCart = useCartStore((state) => state.unsubscribeFromCart);
  const setGuestCartFromLocalStorage = useCartStore((state) => state.setGuestCartFromLocalStorage);

  const fetchStoreData = useProductsStore((state) => state.fetchStoreData);

  /**
   * useEffect hook for handling side effects:
   * 1. Initializes the Firebase Authentication state listener.
   * 2. Dispatches actions to appropriate Zustand stores based on auth state changes.
   * 3. Fetches initial product data for the store.
   * 4. Cleans up Firebase and Firestore listeners on component unmount.
   */
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);

      if (user) {
        console.log("App.jsx: Firebase Auth State Change: User logged in.", user.uid);

        const customUserProfile = await fetchUserProfileFromFirestore(user.uid);
        const combinedUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          username: customUserProfile?.username || null,
          createdAt: customUserProfile?.createdAt || null,
        };

        setUser(combinedUserData);

        await mergeCarts(user.uid);
        subscribeToUserCart(user.uid);
        localStorage.removeItem("myFakeStoreCart");
      } else {
        console.log("App.jsx: Firebase Auth State Changed: User logged out or no user.");
        setUser(null);
        unsubscribeFromCart();
        setGuestCartFromLocalStorage();
      }
      setAuthLoading(false);
    });
    fetchStoreData();

    return () => {
      unsubscribeAuth();
      unsubscribeFromCart();
    };
  }, [
    setUser,
    setAuthLoading,
    fetchUserProfileFromFirestore,
    mergeCarts,
    subscribeToUserCart,
    unsubscribeFromCart,
    setGuestCartFromLocalStorage,
    fetchStoreData,
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHeader />}>
          <Route index element={<MainPage />} />
          <Route path="/item/:id" element={<ProductPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
