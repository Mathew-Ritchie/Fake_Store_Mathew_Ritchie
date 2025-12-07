import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { updateQuery } from "../../Utilities/QueryHelper";
import useProductsStore from "../../GlobalStore/useProductStore";

export default function CategoryDropDown() {
  const { categories, categoryOption, setCategoryOption, setOptionsFromQuery } = useProductsStore();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") || "";
    setOptionsFromQuery({ category });
  }, []);

  const handleChange = (e) => {
    const newCategory = e.target.value;

    updateQuery(searchParams, setSearchParams, {
      category: newCategory,
    });
  };

  //   console.log(categories);

  return (
    <select
      className="bg-gray-300"
      id="category-dropbox"
      value={categoryOption}
      onChange={handleChange}
    >
      <option value="">All Categories</option>
      {categories.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
