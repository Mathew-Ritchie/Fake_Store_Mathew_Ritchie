import React from "react";
import useGlobalStore from "../../GlobalStore/useGlobalStore";

export default function CategoryDropDown() {
  const { categories, categoryOption, setCategoryOption } = useGlobalStore();

  const handleCategoryChange = (event) => {
    setCategoryOption(event.target.value);
  };

  //   console.log(categories);

  return (
    <select
      className="category-dropbox"
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
