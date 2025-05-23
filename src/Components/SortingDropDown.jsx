import React from "react";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function SortingDropDown() {
  const { sortOption, setSortOption } = useGlobalStore();

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <select
      id="select_zone"
      className="sorting-dropdown"
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
