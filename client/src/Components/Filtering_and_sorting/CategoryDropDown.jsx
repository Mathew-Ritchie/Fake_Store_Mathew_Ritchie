import React from "react";
import useProductsStore from "../../GlobalStore/useProductStore";

export default function CategoryDropDown() {
  const { categories, categoryOption, setCategoryOption } = useProductsStore();

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
