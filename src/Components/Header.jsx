import React from "react";
import CategoryDropDown from "./CategoryDropDown";
import SortingDropDown from "./SortingDropDown";

export default function Header() {
  return (
    <div>
      <h1>Welcome to my fake store!!!</h1>
      <CategoryDropDown />
      <SortingDropDown />
    </div>
  );
}
