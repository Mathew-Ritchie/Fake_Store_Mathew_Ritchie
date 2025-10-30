import { useEffect } from "react";
import { Link } from "react-router";

import useProductsStore from "../GlobalStore/useProductStore";

import { FaStar } from "react-icons/fa";
import truncateText from "../Utilities/utils";

export default function StoreItems() {
  const { filteredItems, fetchStoreData, loading, error } = useProductsStore();

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  return (
    <div className="store-items-container bg-gray-100">
      <div className="product-container flex flex-wrap justify-center items-center gap-4 py-4 bg-gray-100">
        {loading && <h1>Items loading...</h1>}
        {error && <h1>There was an error loading data, please try again.</h1>}
        {filteredItems &&
          filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="product-link no-underline text-black"
            >
              <div className="product-card flex flex-col justify-between items-center rounded-lg w-70 h-100 sm:w-48 sm:h-86 p-2 bg-white shadow-xl">
                <div className="product-img-div w-36 h-54 sm:w-28 sm:h-40 flex flex-col justify-center items-center">
                  <img
                    className="product-img w-36 h-54 sm:w-28 sm:h-40 object-contain"
                    src={item.image}
                  />
                </div>
                <div className="product-info-div flex flex-col justify-between items-center h-34">
                  <h1 className="product-title font-light text-md no-underline text-gray-800 w-48 py-2.5 text-center">
                    {truncateText(item.title, 50)}
                  </h1>
                  <div>
                    {" "}
                    <p className="store-item-price font-bold text-lg text-gray-800 mt-0 text-center">
                      R {item.price}
                    </p>
                    <div className="product-rating-div flex items-center gap-1 justify-center ">
                      <FaStar className="faStar text-amber-300" />
                      <p className="m-0 no-underline text-gray-500">{`${item.rating.rate}(${item.rating.count})`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <p className="store-items-total text-center text-gray-800 m-0 py-4 font-bold">
        {filteredItems.length} Items
      </p>
    </div>
  );
}
