import React from "react";
import StoreItems from "../Components/StoreItems";
import SortAndFilterHeader from "../Components/Headers_and_Footers/SortAndFilterHeader";
import LoginAndRegisterHeader from "../Components/Headers_and_Footers/LoginAndRegisterHeader";

export default function MainPage() {
  return (
    <div>
      <SortAndFilterHeader />
      <StoreItems />
    </div>
  );
}
