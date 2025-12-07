import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

//Wake up Back end
//import useWakeServer from "./GlobalStore/useWakeServer";

import { useUserStore } from "./GlobalStore/useUserStore";
//importing new zustand stores. favourites is not currently needed here as it is not connected to firebase.
//import useAuthStore from "./GlobalStore/useAuthStore";
import useCartStore from "./GlobalStore/useCartStore";
import useProductsStore from "./GlobalStore/useProductStore";
import useFavouritesStore from "./GlobalStore/useFavouritesStore"; //Not currently needed as this still works on Localstorage
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
import LandingPage from "./Pages/LandingPage";

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
  //useWakeServer();
  const { fetchCart } = useCartStore();
  const { fetchFavourites } = useFavouritesStore();
  const loadUserFromToken = useUserStore((state) => state.loadUserFromToken);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const fetchStoreData = useProductsStore((state) => state.fetchStoreData);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchFavourites();
    }
  }, [user, fetchCart, fetchFavourites]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHeader />}>
          <Route index element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
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
