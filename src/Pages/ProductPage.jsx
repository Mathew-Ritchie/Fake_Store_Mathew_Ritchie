import React from "react";
import ProductDescriptionCard from "../Components/ProductDescriptionCard";
import ProductPageHeader from "../Components/Headers_and_Footers/ProductPageHeader";
import ProductPageFooter from "../Components/Headers_and_Footers/ProductPageFooter";

export default function ProductPage() {
  return (
    <div className="product-page-background-div">
      <ProductPageHeader />
      <ProductDescriptionCard />
      <ProductPageFooter />
    </div>
  );
}
