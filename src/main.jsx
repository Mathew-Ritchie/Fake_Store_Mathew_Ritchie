import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FakeStore from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FakeStore />
  </StrictMode>
);
