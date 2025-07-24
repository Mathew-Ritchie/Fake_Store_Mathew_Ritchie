import React from "react";
import CategoryDropDown from "../Filtering_and_sorting/CategoryDropDown";
import SortingDropDown from "../Filtering_and_sorting/SortingDropDown";
import Cart from "../buttons/CartBtn";
// import "./sortAndFilterHeader.css";
import "./test.css";
import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";

export default function SortAndFilterHeader() {
  return (
    <div className="sort-filter-header-div">
      <div className="sort-filter-header-sort-category-div">
        <CategoryDropDown />
        <SortingDropDown />
      </div>

      <div className="sort-filter-header-cart-favourites-div">
        <GoToFavouritesBtn />
        <Cart />
      </div>
    </div>
  );
}
