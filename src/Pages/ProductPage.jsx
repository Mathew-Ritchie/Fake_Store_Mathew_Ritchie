import React from "react";
import ProductDescriptionCard from "../Components/ProductDescriptionCard";
import ProductPageHeader from "../Components/ProductPageHeader";
import ProductPageFooter from "../Components/ProductPageFooter";

export default function ProductPage() {
  return (
    <div>
      <ProductPageHeader />
      <ProductDescriptionCard />
      <ProductPageFooter />
    </div>
  );
}
