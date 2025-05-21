import React, { useState, useEffect } from "react";
import useGlobalStore from "./GlobalStore/useGlobalStore";
import "./App.css";
import { FaStar } from "react-icons/fa";

export default function FakeStore() {
  const { storeItems, fetchStoreData, loading, error } = useGlobalStore();

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return `${text.slice(0, limit)}...`;
  };

  console.log(storeItems);
  return (
    <div className="product-container">
      {loading && <h1>Items loading...</h1>}
      {error && <h1>There was an error loading data, please try again.</h1>}
      {storeItems &&
        storeItems.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-img-div">
              <img className="product-img" src={item.image} />
            </div>
            <h1 className="product-title">{truncateText(item.title, 50)}</h1>
            <p>From R {item.price}</p>
            <div className="product-rating-div">
              <FaStar />
              <p>{`${item.rating.rate}(${item.rating.count})`}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
