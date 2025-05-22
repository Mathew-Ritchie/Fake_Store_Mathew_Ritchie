import React, { useEffect } from "react";
import { useParams } from "react-router";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function ProductDescriptionCard() {
  const { productInfo, loading, error, fetchProductInfo } = useGlobalStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProductInfo(id);
    }
  }, [id]);

  console.log(productInfo);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error.message || "Failed to load product."}</div>;
  }

  if (!productInfo) {
    return <div>No product data available.</div>;
  }
  return (
    <div>
      <h1>{productInfo.title}</h1>
      <img src={productInfo.image} style={{ width: "150px" }} />
      <p>{productInfo.description}</p>
      <p>{productInfo.category}</p>

      <p>${typeof productInfo.price === "number" ? productInfo.price.toFixed(2) : "N/A"}</p>

      {productInfo.rating &&
      typeof productInfo.rating === "object" &&
      productInfo.rating.rate !== undefined &&
      productInfo.rating.count !== undefined ? (
        <p>{`${productInfo.rating.rate} (${productInfo.rating.count})`}</p>
      ) : (
        <p>Rating: N/A</p>
      )}
    </div>
  );
}
