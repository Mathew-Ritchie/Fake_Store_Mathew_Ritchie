import React, { useEffect, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import "./add-to-favourites-btn.css";

export default function AddToFavouritesBtn() {
  const { productInfo, toggleFavourite, isProductFavourite } = useGlobalStore();

  const isFavourite = productInfo ? isProductFavourite(productInfo.id) : false;

  const handleToggleFavourite = () => {
    if (!productInfo || typeof productInfo.id === "undefined") {
      console.warn("Product info or ID is missing, cannot toggle favourite status!");
      return;
    }
    toggleFavourite(productInfo);
  };

  return (
    <div>
      <button onClick={handleToggleFavourite} className="favourites-btn">
        {isFavourite ? <IoIosHeart /> : <IoIosHeartEmpty />}
      </button>
    </div>
  );
}
