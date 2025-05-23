import React from "react";
import StoreItems from "../Components/StoreItems";
import SortAndFilterHeader from "../Components/SortAndFilterHeader";

export default function MainPage() {
  return (
    <div>
      <SortAndFilterHeader />
      <StoreItems />
    </div>
  );
}
