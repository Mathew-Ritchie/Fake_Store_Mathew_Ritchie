import React, { useEffect, useState } from "react";
import CategoryDropDown from "../Filtering_and_sorting/CategoryDropDown";
import SortingDropDown from "../Filtering_and_sorting/SortingDropDown";
import Cart from "../buttons/CartBtn";
import "./sort-and-filter-header.css";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";

export default function SortAndFilterHeader() {
  const { filteredItems } = useGlobalStore();
  const [itemQuantity, setItemQuantity] = useState(0);

  //Use effect sets the itemQuantity.
  useEffect(() => {
    setItemQuantity(filteredItems.length);
  }, [filteredItems.length]);
  //console.log(itemQuantity);
  // console.log(storeItems);
  return (
    <div className="sort-filter-header-div">
      {/* <h1>Welcome to my fake store!!!</h1> */}
      <p className="sort-filter-header-p">{itemQuantity} products</p>
      <CategoryDropDown />
      <SortingDropDown />
      <GoToFavouritesBtn />
      <Cart />
    </div>
  );
}
