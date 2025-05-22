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

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
