import React, { useEffect, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import "./add-to-favourites-btn.css";

export default function AddToFavouritesBtn() {
  const { productInfo } = useGlobalStore();
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (productInfo && productInfo.id) {
      try {
        const currentFavourites = JSON.parse(localStorage.getItem("myFakeStoreFavourites") || "[]");
        const foundInFavourites = currentFavourites.some((item) => item.id === productInfo.id);
        setIsFavourite(foundInFavourites);
      } catch (error) {
        console.error("Failed to parse favourites from localStorage:", error);

        setIsFavourite(false);
      }
    } else {
      setIsFavourite(false);
    }
  }, [productInfo]);

  const handleAddToFavourites = () => {
    if (!productInfo || !productInfo.id) {
      console.warn("Product info is missing!");
      return;
    }

    let currentFavourites = JSON.parse(localStorage.getItem("myFakeStoreFavourites") || "[]");
    const existingFavouriteIndex = currentFavourites.findIndex(
      (item) => item.id === productInfo.id
    );

    if (existingFavouriteIndex !== -1) {
      currentFavourites.splice(existingFavouriteIndex, 1);
      setIsFavourite(false);
      console.log(`${productInfo.title} removed from favourites!`);
    } else {
      currentFavourites.push({ ...productInfo });
      setIsFavourite(true);
      console.log(`${productInfo.title} added to favourites!`);
    }

    localStorage.setItem("myFakeStoreFavourites", JSON.stringify(currentFavourites));
  };

  return (
    <div>
      <button onClick={handleAddToFavourites} className="favourites-btn">
        {isFavourite ? <IoIosHeart /> : <IoIosHeartEmpty />}
      </button>
    </div>
  );
}
