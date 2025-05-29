import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./app.css";

import ProductPage from "./Pages/ProductPage";
import MainPage from "./Pages/MainPage";
import MainHeader from "./Components/Headers_and_Footers/MainHeader";
import FavouritesPage from "./Pages/FavouritesPage";
import CartPage from "./Pages/CartPage";
import Login from "./credentialCertification/LogIn";
import Register from "./credentialCertification/Register";

export default function App() {
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
