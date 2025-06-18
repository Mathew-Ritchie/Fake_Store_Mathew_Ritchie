import React from "react"; // No need for useEffect here anymore as state is global
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useFavouritesStore from "../../GlobalStore/useFavouritesStore";
import useProductsStore from "../../GlobalStore/useProductStore";

export default function AddToFavouritesBtn({ product }) {
  const { toggleFavourite, isProductFavourite } = useFavouritesStore();

  const fetchedProductInfo = useProductsStore((state) => state.productInfo);

  const productForButton = product || fetchedProductInfo;

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
        className="favourites-btn icons"
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
