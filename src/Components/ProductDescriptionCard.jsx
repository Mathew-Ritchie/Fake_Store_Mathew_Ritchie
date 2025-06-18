import React, { useEffect } from "react";
import { useParams } from "react-router";
//import useGlobalStore from "../GlobalStore/useGlobalStore";
import useProductsStore from "../GlobalStore/useProductStore";
import { FaStar } from "react-icons/fa";
import "./product-description-card.css";

export default function ProductDescriptionCard() {
  const { productInfo, loading, error, fetchProductInfo } = useProductsStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProductInfo(id);
    }
  }, [id]);

  //   console.log(productInfo);

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
    <div className="individual-product-info-div">
      <div className="individual-product-img-div">
        <img src={productInfo.image} style={{ width: "150px" }} />
      </div>
      <div className="individual-product-title-desc-div">
        <h1 className="individual-product-title">{productInfo.title}</h1>
        <p>{productInfo.description}</p>
      </div>
      <div className="individual-product-price-rating-div">
        <p className="individual-product-price">
          R{typeof productInfo.price === "number" ? productInfo.price.toFixed(2) : "N/A"}
        </p>
        {productInfo.rating &&
        typeof productInfo.rating === "object" &&
        productInfo.rating.rate !== undefined &&
        productInfo.rating.count !== undefined ? (
          <div className="individual-product-rating-div">
            <FaStar className="faStar" />
            <p>{`${productInfo.rating.rate} (${productInfo.rating.count})`}</p>
          </div>
        ) : (
          <p>Rating: N/A</p>
        )}
      </div>
    </div>
  );
}
