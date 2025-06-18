import React from "react";
import useProductsStore from "../../GlobalStore/useProductStore";
import "./dropdowns.css";

export default function SortingDropDown() {
  const { sortOption, setSortOption } = useProductsStore();

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <select
      id="select_zone"
      className="sorting-dropdown dropdown"
      value={sortOption}
      onChange={handleSortChange}
    >
      <option value="none">Sort</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="Lowest">Lowest price</option>
      <option value="Highest">Highest price</option>
    </select>
  );
}
