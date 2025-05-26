import React from "react"; // No need for useEffect here anymore as state is global
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useGlobalStore from "../../GlobalStore/useGlobalStore";
import "./add-to-favourites-btn.css";

export default function AddToFavouritesBtn({ product }) {
  const { toggleFavourite, isProductFavourite, productInfo: globalProductInfo } = useGlobalStore();

  const productForButton = product || globalProductInfo;

  const isFavourite = productForButton ? isProductFavourite(productForButton.id) : false;

  const handleToggleFavourite = () => {
    if (!productForButton || typeof productForButton.id === "undefined") {
      console.warn(
        "AddToFavouritesBtn: Cannot toggle favourite. Product data or ID is missing for this button instance.",
        productForButton
      );
      return;
    }

    toggleFavourite(productForButton);
  };

  return (
    <div>
      <button
        onClick={handleToggleFavourite}
        className="favourites-btn"
        disabled={!productForButton || typeof productForButton.id === "undefined"}
        title={
          isFavourite
            ? `Remove ${productForButton?.title || "item"} from favourites`
            : `Add ${productForButton?.title || "item"} to favourites`
        }
      >
        {isFavourite ? (
          <IoIosHeart className="favourite-icon icons" />
        ) : (
          <IoIosHeartEmpty className="not-favourite-icon icons" />
        )}
      </button>
    </div>
  );
}
