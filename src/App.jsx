import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import ProductPage from "./Pages/ProductPage";
import MainPage from "./Pages/MainPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/item/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
