import React from "react";
import { IoCartOutline } from "react-icons/io5";
import "./cart.css";
import { useEffect, useState } from "react";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function Cart() {
  const { productInfo } = useGlobalStore();
  const [totalCart, setTotalCart] = useState([]);

  useEffect(() => {
    const currentCart = JSON.parse(localStorage.getItem("myFakeStoreCart") || "[]");
    setTotalCart(currentCart);
  }, [productInfo]);
  console.log(totalCart);

  return <IoCartOutline className="IoCartOutline" />;
}

{
  /* <IoCartSharp /> */
}
