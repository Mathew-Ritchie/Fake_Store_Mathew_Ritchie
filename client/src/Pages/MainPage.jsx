import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProductsStore from "../GlobalStore/useProductStore";

import StoreItems from "../Components/StoreItems";
import SortAndFilterHeader from "../Components/Headers_and_Footers/SortAndFilterHeader";
import WelcomeModal from "../Components/modal/ModalIntro";

export default function MainPage() {
  const fetchStoreData = useProductsStore((s) => s.fetchStoreData);
  const setOptionsFromQuery = useProductsStore((s) => s.setOptionsFromQuery);

  const [searchParams] = useSearchParams();

  // 🔥 Fetch products once
  useEffect(() => {
    fetchStoreData();
  }, []);

  // 🔥 Sync URL → Zustand (runs on page load)
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";

    setOptionsFromQuery({
      category,
      sort,
    });
  }, [searchParams]);

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* <WelcomeModal /> */}
      <SortAndFilterHeader />
      <StoreItems />
    </div>
  );
}
