import React from "react";
import useGlobalStore from "../GlobalStore/useGlobalStore";

export default function CategoryDropDown() {
  const { categories } = useGlobalStore();

  //   const handleGenreChange = (event) => {
  //     setGenreOption(event.target.value);
  //   };
  console.log(categories);

  return (
    <select className="category-dropbox" id="category-dropbox">
      <option value="">All Categories</option>
      {categories.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
