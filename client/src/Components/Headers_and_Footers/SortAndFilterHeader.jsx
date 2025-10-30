import React from "react";
import CategoryDropDown from "../Filtering_and_sorting/CategoryDropDown";
import SortingDropDown from "../Filtering_and_sorting/SortingDropDown";
import Cart from "../buttons/GoToCartBtn";

import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";

export default function SortAndFilterHeader() {
  return (
    <div className="sort-filter-header-div relative z-10 flex justify-between items-center pb-0.5 h-8 bg-gray-600">
      <div className="sort-filter-header-sort-category-div flex items-center justify-start gap-2 pl-2.5">
        <CategoryDropDown />
        <SortingDropDown />
      </div>

      <div className="sort-filter-header-cart-favourites-div flex justify-end items-center gap-1 leading-3 pr-2.5">
        <GoToFavouritesBtn />
        <Cart />
      </div>
    </div>
  );
}
