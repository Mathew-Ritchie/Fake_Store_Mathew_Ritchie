import React, { useState, useEffect } from "react";
import useGlobalStore from "./GlobalStore/useGlobalStore";
import "./App.css";
import { FaStar } from "react-icons/fa";

export default function FakeStore() {
  // const [storeData, setStoreData] = useState();
  const { storeItems, fetchStoreData, loading, error } = useGlobalStore();

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // useEffect(() => {
  //   async function fetchStoreData() {
  //     try {
  //       const response = await fetch("https://fakestoreapi.com/products");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       // console.log("Data inside fetchStoreData:", data);
  //       setStoreData(data);
  //     } catch (error) {
  //       console.error("An error occurred:", error);
  //       throw error;
  //     }
  //   }
  //   fetchStoreData();
  // }, []);

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return `${text.slice(0, limit)}...`;
  };

  console.log(storeItems);
  return (
    <div className="product-container">
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
