import React from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function ProductPageFooter() {
  const { productInfo } = useGlobalStore();

  return (
    <div>
      <IoIosHeartEmpty />
      {/* <IoIosHeart /> */}
      <button>Add to cart</button>
    </div>
  );
}
