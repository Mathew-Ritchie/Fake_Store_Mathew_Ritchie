import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./app.css";

import ProductPage from "./Pages/ProductPage";
import MainPage from "./Pages/MainPage";
import MainHeader from "./Components/Headers_and_Footers/MainHeader";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHeader />}>
          <Route index element={<MainPage />} />
          <Route path="/item/:id" element={<ProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
