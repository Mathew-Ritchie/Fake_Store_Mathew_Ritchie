import React from "react";
import { Link } from "react-router";
import useFavouritesStore from "../../GlobalStore/useFavouritesStore";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export default function GoToFavouritesBtn() {
  const { favourites } = useFavouritesStore();

  const hasFavourites = favourites && favourites.length > 0;

  return (
    <div>
      <Link to={"/favourites"}>
        {hasFavourites ? (
          <IoIosHeart className="icons text-2xl text-white bg-transparent border-0" />
        ) : (
          <IoIosHeartEmpty className="icons text-2xl text-white bg-transparent border-0" />
        )}
      </Link>
    </div>
  );
}
