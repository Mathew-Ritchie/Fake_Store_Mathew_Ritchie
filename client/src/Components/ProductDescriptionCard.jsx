import React, { useEffect } from "react";
import { useParams } from "react-router";

import useProductsStore from "../GlobalStore/useProductStore";
import { FaStar } from "react-icons/fa";

export default function ProductDescriptionCard() {
  const { productInfo, loading, error, fetchProductInfo } = useProductsStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProductInfo(id);
    }
    console.log(productInfo);
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
    <div className="individual-product-info-div w-full sm:w-[500px] p-5 bg-white">
      <div className="individual-product-img-div flex justify-center items-center border-b-2 border-gray-300 pb-5">
        <img src={productInfo.image} style={{ width: "150px" }} />
      </div>
      <div className="individual-product-title-desc-div border-b-2 border-gray-300">
        <h1 className="individual-product-title font-extralight text-2xl">{productInfo.title}</h1>
        <p>{productInfo.description}</p>
      </div>
      <div className="individual-product-price-rating-div flex justify-between items-center pt-2.5     ">
        <p className="individual-product-price text-2xl font-extrabold m-0">
          R{typeof productInfo.price === "number" ? productInfo.price.toFixed(2) : "N/A"}
        </p>
        {productInfo.rating &&
        typeof productInfo.rating === "object" &&
        productInfo.rating.rate !== undefined &&
        productInfo.rating.count !== undefined ? (
          <div className="individual-product-rating-div flex justify-center items-center g-3">
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
