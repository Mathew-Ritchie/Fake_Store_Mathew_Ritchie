import React, { useEffect, useState } from "react";
import CategoryDropDown from "../Filtering_and_sorting/CategoryDropDown";
import SortingDropDown from "../Filtering_and_sorting/SortingDropDown";
import Cart from "../buttons/CartBtn";
import "./sort-and-filter-header.css";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";

export default function SortAndFilterHeader() {
  return (
    <div className="sort-filter-header-div">
      <CategoryDropDown />
      <SortingDropDown />
      <GoToFavouritesBtn />
      <Cart />
    </div>
  );
}
