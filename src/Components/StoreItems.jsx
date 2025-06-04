import React, { useEffect } from "react";
import { Link } from "react-router";
import useGlobalStore from "../GlobalStore/useGlobalStore";
import "./storeItems.css";
import { FaStar } from "react-icons/fa";
import truncateText from "../Utilities/utils";
import AddToFavouritesBtn from "./buttons/AddToFavouritesBtn";

export default function StoreItems() {
  const { filteredItems, storeItems, fetchStoreData, loading, error } = useGlobalStore();

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // console.log(storeItems);
  return (
    <div>
      <div className="product-container">
        {loading && <h1>Items loading...</h1>}
        {error && <h1>There was an error loading data, please try again.</h1>}
        {filteredItems &&
          filteredItems.map((item) => (
            <Link key={item.id} to={`/item/${item.id}`} className="product-link">
              <div className="product-card">
                <div className="product-img-div">
                  <img className="product-img" src={item.image} />
                </div>
                <h1 className="product-title">{truncateText(item.title, 50)}</h1>
                <p className="store-item-price">R {item.price}</p>
                <div className="product-rating-div">
                  <FaStar className="faStar" />
                  <p>{`${item.rating.rate}(${item.rating.count})`}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <p className="store-items-total">{filteredItems.length} Items</p>
    </div>
  );
}
