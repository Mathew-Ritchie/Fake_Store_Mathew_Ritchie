import React from "react";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import "./dropdowns.css";

export default function CategoryDropDown() {
  const { categories, categoryOption, setCategoryOption } = useGlobalStore();

  const handleCategoryChange = (event) => {
    setCategoryOption(event.target.value);
  };

  //   console.log(categories);

  return (
    <select
      className="category-dropbox dropdown"
      id="category-dropbox"
      value={categoryOption}
      onChange={handleCategoryChange}
    >
      <option value="">Categories</option>
      {categories.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
