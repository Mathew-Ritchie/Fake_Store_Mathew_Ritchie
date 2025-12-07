import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProductsStore from "../../GlobalStore/useProductStore";
import { updateQuery } from "../../Utilities/QueryHelper";

export default function SortDropDown() {
  const { sortOption, setSortOption, setOptionsFromQuery } = useProductsStore();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sort = searchParams.get("sort") || "";
    setOptionsFromQuery({ sort });
  }, []);

  const handleChange = (e) => {
    const newSort = e.target.value;

    setSortOption(newSort);

    updateQuery(searchParams, setSearchParams, {
      sort: newSort,
    });
  };

  return (
    <select className="bg-gray-300" value={sortOption} onChange={handleChange}>
      <option value="">Sort...</option>
      <option value="A-Z">A → Z</option>
      <option value="Z-A">Z → A</option>
      <option value="Lowest">Lowest Price</option>
      <option value="Highest">Highest Price</option>
    </select>
  );
}
