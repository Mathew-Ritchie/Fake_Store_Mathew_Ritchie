import React from "react";
import { Link } from "react-router";
import AddToFavouritesBtn from "../Components/buttons/AddToFavouritesBtn";
import useFavouritesStore from "../GlobalStore/useFavouritesStore";
import "./favourite-items.css";

export default function FavouritesPage() {
  const { favourites } = useFavouritesStore();

  return (
    <div className="favourites-list">
      {favourites.map((item) => (
        <div key={item.id} className="favourite-item-card">
          <Link to={`/item/${item.id}`}>
            <img src={item.image} alt={item.title} className="favourite-item-image" />
          </Link>
          <div className="favourite-item-details">
            <Link className="favourite-item-link" to={`/item/${item.id}`}>
              <h4 className="favourite-item-title">{item.title}</h4>
            </Link>
            <div className="favourite-remove-btn">
              <AddToFavouritesBtn product={item} />
            </div>

            {/* {item.price && <p className="favourite-item-price">${item.price.toFixed(2)}</p>} */}
          </div>
        </div>
      ))}
    </div>
  );
}
