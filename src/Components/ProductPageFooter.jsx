import React from "react";
import AddToCartBtn from "./buttons/AddToCartBtn";
import AddToFavouritesBtn from "./buttons/AddToFavouritesBtn";
import "./product-page-footer.css";

export default function ProductPageFooter() {
  return (
    <div className="product-page-footer-div">
      <AddToFavouritesBtn />
      <AddToCartBtn />
    </div>
  );
}
