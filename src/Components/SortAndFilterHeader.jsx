import React, { useEffect, useState } from "react";
import CategoryDropDown from "./CategoryDropDown";
import SortingDropDown from "./SortingDropDown";
import Cart from "./Cart";
import "./sort-and-filter-header.css";
import useGlobalStore from "../GlobalStore/useGlobalStore";

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
      <p className="sort-filter-header-p">Items: {itemQuantity}</p>
      <CategoryDropDown />
      <SortingDropDown />
      <Cart />
    </div>
  );
}
