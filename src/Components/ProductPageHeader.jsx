import React from "react";
import { Link } from "react-router";
import useGlobalStore from "../GlobalStore/useGlobalStore";
import truncateText from "../Utilities/utils";
import { IoIosArrowRoundBack } from "react-icons/io";
import Cart from "./Cart";
import "./product-page-header.css";

export default function ProductPageHeader() {
  const { productInfo } = useGlobalStore();
  //   console.log(productInfo);

  return (
    <div className="product-page-header-div">
      <div className="product-page-header-inner-div">
        <Link to={"/"} className="product-page-header-link">
          <IoIosArrowRoundBack className="back-arrow" />
        </Link>
        <h3 className="product-page-header-title">
          {productInfo.title ? truncateText(productInfo.title, 30) : "Loading..."}
        </h3>
      </div>
      <Cart />
    </div>
  );
}
