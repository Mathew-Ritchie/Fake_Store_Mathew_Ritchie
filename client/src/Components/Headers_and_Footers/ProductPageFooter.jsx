import React from "react";
import AddToCartBtn from "../buttons/AddToCartBtn";
import AddToFavouritesBtn from "../buttons/AddToFavouritesBtn";

export default function ProductPageFooter() {
  return (
    <div className="product-page-footer-div flex items-center pb-5 mb-10 justify-center gap-5 bg-white w-full sm:w-[500px]">
      <AddToFavouritesBtn />
      <AddToCartBtn />
    </div>
  );
}
