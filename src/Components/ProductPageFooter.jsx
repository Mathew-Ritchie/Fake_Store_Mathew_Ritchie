import React from "react";
import AddToCartBtn from "./AddToCartBtn";
import AddToFavouritesBtn from "./AddToFavouritesBtn";

export default function ProductPageFooter() {
  return (
    <div>
      <AddToFavouritesBtn />
      <AddToCartBtn />
    </div>
  );
}
