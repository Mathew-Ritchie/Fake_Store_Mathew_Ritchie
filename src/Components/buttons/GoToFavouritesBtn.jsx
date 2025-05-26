import React from "react";
import { Link } from "react-router";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export default function GoToFavouritesBtn() {
  const { favourites } = useGlobalStore();

  const hasFavourites = favourites && favourites.length > 0;

  return (
    <div>
      <Link to={"/favourites"}>
        {hasFavourites ? <IoIosHeart className="icons" /> : <IoIosHeartEmpty className="icons" />}
      </Link>
    </div>
  );
}
