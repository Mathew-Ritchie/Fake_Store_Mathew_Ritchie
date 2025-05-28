import React from "react";
import AddToFavouritesBtn from "../Components/buttons/AddToFavouritesBtn";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function FavouritesPage() {
  const { favourites } = useGlobalStore();

  return (
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
  );
}
