import React from "react";
import ProductDescriptionCard from "../Components/ProductDescriptionCard";
import ProductPageHeader from "../Components/Headers_and_Footers/ProductPageHeader";
import ProductPageFooter from "../Components/Headers_and_Footers/ProductPageFooter";

export default function ProductPage() {
  return (
    <div className="product-page-background-div min-h-screen flex flex-col items-center w-full bg-gray-100">
      <ProductPageHeader />
      <ProductDescriptionCard />
      <ProductPageFooter />
    </div>
  );
}
