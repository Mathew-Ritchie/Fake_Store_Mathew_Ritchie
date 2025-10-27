import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Use react-router-dom for Link
import AddToFavouritesBtn from "../Components/buttons/AddToFavouritesBtn";
import useFavouritesStore from "../GlobalStore/useFavouritesStore";
import useProductsStore from "../GlobalStore/useProductStore"; // <-- Import product store

export default function FavouritesPage() {
  const { favourites, fetchFavourites } = useFavouritesStore();
  const { fetchProductInfo } = useProductsStore();

  // State to cache the product details (image/price)
  const [detailedProducts, setDetailedProducts] = useState({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // 1. Fetch user's favourites on mount
  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  // 2. Fetch product details when the favourites list changes
  useEffect(() => {
    if (favourites.length === 0) {
      setDetailedProducts({});
      return;
    }

    // Identify items whose details are NOT ALREADY in the cache
    const itemsToFetch = favourites.filter((item) => !detailedProducts[item.item_id]);
    const uniqueItemIds = [...new Set(itemsToFetch.map((item) => item.item_id))];

    // Skip fetch if all details are cached
    if (uniqueItemIds.length === 0) {
      setIsLoadingDetails(false);
      return;
    }

    setIsLoadingDetails(true);

    const fetchAllDetails = async () => {
      const newDetails = {};

      const productPromises = uniqueItemIds.map(async (itemId) => {
        try {
          // Fetch product details using the stable item_id
          const info = await fetchProductInfo(itemId);

          if (info === null) {
            newDetails[itemId] = { image: null, price: null };
            return;
          }

          newDetails[itemId] = {
            image: info.image,
            price: info.price,
          };
        } catch (error) {
          console.error(`Failed to fetch details for item ${itemId}:`, error);
          newDetails[itemId] = { image: null, price: null };
        }
      });

      await Promise.all(productPromises);

      // Merge new details with existing details to update the cache
      setDetailedProducts((prev) => ({ ...prev, ...newDetails }));
      setIsLoadingDetails(false);
    };

    fetchAllDetails();

    return () => setIsLoadingDetails(false);
  }, [favourites, detailedProducts, fetchProductInfo]);

  // 3. Merge favourites data with fetched product details
  const favouritesWithDetails = useMemo(() => {
    if (!favourites || favourites.length === 0) return [];

    // Return un-enhanced favourites if details are still loading
    const isReady = !isLoadingDetails || Object.keys(detailedProducts).length > 0;
    if (!isReady) return favourites;

    return favourites.map((item) => {
      const details = detailedProducts[item.item_id];

      return {
        ...item,
        // Use the product's image and price, defaulting to null
        image: details?.image ?? null,
        price: details?.price ?? null,
      };
    });
  }, [favourites, detailedProducts, isLoadingDetails]);

  // --- Render logic ---
  if (isLoadingDetails && favourites.length > 0) {
    return (
      <div className="favourites-loading-message">
        <h2>Loading Favourites...</h2>
        <p>Fetching product information...</p>
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="favourites-empty-message">
        <h2>Your Favourites List</h2>
        <p>You haven't added any favourites yet!</p>
      </div>
    );
  }

  return (
    <div className="favourites-list sm:w-[500px] bg-white w-full">
      {favouritesWithDetails.map(
        (
          item // <-- Map over merged data
        ) => (
          <div
            key={item.id}
            className="favourite-item-card flex justify-start items-center p-2.5 gap-2.5 border-b-2 border-gray-300"
          >
            <Link to={`/item/${item.item_id}`}>
              {" "}
              {/* Use item_id for product page */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="favourite-item-image w-24 h-24 object-contain"
                />
              ) : (
                <div className="favourite-item-image-placeholder">No Image</div>
              )}
            </Link>
            <div className="favourite-item-details w-full">
              <Link
                className="favourite-item-link no-underline text-black"
                to={`/item/${item.item_id}`}
              >
                {" "}
                {/* Use item_id */}
                <h4 className="favourite-item-title">{item.title}</h4>
              </Link>

              {item.price !== null && item.price !== undefined && (
                <p className="favourite-item-price">R{item.price.toFixed(2)}</p>
              )}

              <div className="favourite-remove-btn">
                {/* AddToFavouritesBtn logic handles the toggle/remove */}
                <AddToFavouritesBtn
                  product={{
                    ...item,
                    id: item.item_id,
                  }}
                />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
