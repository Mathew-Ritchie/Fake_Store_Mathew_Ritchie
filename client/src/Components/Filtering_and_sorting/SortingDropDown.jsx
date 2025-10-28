import React from "react";
import useProductsStore from "../../GlobalStore/useProductStore";

export default function SortingDropDown() {
  const { sortOption, setSortOption } = useProductsStore();

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <select id="select_zone" className="bg-gray-300" value={sortOption} onChange={handleSortChange}>
      <option value="none">Sort</option>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="Lowest">Lowest price</option>
      <option value="Highest">Highest price</option>
    </select>
  );
}
