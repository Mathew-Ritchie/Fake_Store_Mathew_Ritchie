import React from "react";
import { Link } from "react-router";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export default function GoToFavouritesBtn() {
  const { productInfo, isProductFavourite } = useGlobalStore();

  const isFavourite = productInfo ? isProductFavourite(productInfo.id) : false;

  return (
    <div>
      <Link to={"/favourites"}>{isFavourite ? <IoIosHeart /> : <IoIosHeartEmpty />}</Link>
    </div>
  );
}
