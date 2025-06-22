import React from "react";
import { Link } from "react-router";

import useFavouritesStore from "../GlobalStore/useFavouritesStore";

import { IoIosArrowRoundBack } from "react-icons/io";

import FavouriteItems from "../Components/FavouriteItems";
import "./favourites-page.css";
import HomeButton from "../Components/buttons/HomeButton";

//Favourites layout function. If there are items in favourites then they
export default function FavouritesPage() {
  const { favourites } = useFavouritesStore();

  //If there is no favourites or length is equal to 0.
  if (!favourites || favourites.length === 0) {
    return (
      <div className="favourites-empty-message">
        <HomeButton />
        {/* <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link> */}
        <h2>Your Favourites</h2>
        <p>You haven't added any items to your favourites yet. Go explore the store!</p>
      </div>
    );
  }

  //If there are favourites.
  return (
    <div className="favourites-page-container">
      <div className="favourites-page-link-title-div">
        <HomeButton />
        {/* <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link> */}
      </div>
      <h2 className="cart-page-sub-title">Your Favourites</h2>
      <FavouriteItems />
    </div>
  );
}
