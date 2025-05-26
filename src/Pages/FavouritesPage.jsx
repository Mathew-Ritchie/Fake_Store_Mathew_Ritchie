import React, { useEffect, useState } from "react";
import AddToFavouritesBtn from "../Components/buttons/AddToFavouritesBtn";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function FavouritesPage() {
  const { favourites } = useGlobalStore();

  if (!favourites || favourites.length === 0) {
    return (
      <div className="favourites-empty-message">
        <h2>Your Favourites</h2>
        <p>You haven't added any items to your favourites yet. Go explore the store!</p>
      </div>
    );
  }

  return (
    <div className="favourites-page-container">
      <h2>Your Favourites</h2>
      <div className="favourites-list">
        {favourites.map((item) => (
          <div key={item.id} className="favourite-item-card">
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
              className="favourite-item-image"
            />
            <div className="favourite-item-details">
              <h1>{item.title}</h1>

              <AddToFavouritesBtn product={item} />

              {item.price && <p className="favourite-item-price">${item.price.toFixed(2)}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
