import React, { useState, useEffect } from "react";
import "./App.css";

export default function FakeStore() {
  const [storeData, setStoreData] = useState();

  useEffect(() => {
    async function fetchStoreData() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Data inside fetchStoreData:", data);
        setStoreData(data);
      } catch (error) {
        console.error("An error occurred:", error);
        throw error;
      }
    }
    fetchStoreData();
  }, []);

  console.log(storeData);
  return (
    <div className="product-container">
      {storeData &&
        storeData.map((item) => (
          <div className="product-card">
            <img className="product-img" src={item.image} />
            <h1 className="product-title">{item.title}</h1>
            <p>From R {item.price}</p>
            <p>{`${item.rating.rate}(${item.rating.count})`}</p>
          </div>
        ))}
    </div>
  );
}
