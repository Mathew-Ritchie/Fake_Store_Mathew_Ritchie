import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import HomeButton from "../Components/buttons/HomeButton";
import useCartStore from "../GlobalStore/useCartStore";
import { useUserStore } from "../GlobalStore/useUserStore";
import useProductsStore from "../GlobalStore/useProductStore";

export default function CartPage() {
  const { cart, fetchCart, addToCart, removeFromCart, clearCart } = useCartStore();
  const user = useUserStore((state) => state.user);
  const { fetchProductInfo } = useProductsStore();

  const [detailedProducts, setDetailedProducts] = useState({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch user's cart on mount
  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  // ----------------------------------------------------------------
  // --- FIX: Caching Logic in useEffect to prevent re-fetching ---
  // ----------------------------------------------------------------
  useEffect(() => {
    if (cart.length === 0) {
      setDetailedProducts({});
      return;
    }

    // 1. Identify items whose details are NOT ALREADY in the cache
    const itemsToFetch = cart.filter((item) => !detailedProducts[item.item_id]);
    const uniqueItemIds = [...new Set(itemsToFetch.map((item) => item.item_id))];

    // 2. If all necessary details are cached, skip the fetch and loading state.
    if (uniqueItemIds.length === 0) {
      setIsLoadingDetails(false); // Ensure loading is false if nothing needs fetching
      return;
    }

    // 3. Only set loading state if we actually need to fetch new data
    setIsLoadingDetails(true);

    const fetchAllDetails = async () => {
      const newDetails = {};

      const productPromises = uniqueItemIds.map(async (itemId) => {
        try {
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
  }, [cart, detailedProducts, fetchProductInfo]); // detailedProducts is now a dependency

  // --- useMemo to combine cart data with fetched details ---
  const cartWithDetails = useMemo(() => {
    if (!cart || cart.length === 0) return []; // Default to empty array if cart is empty

    // We only need to check the detailedProducts cache if we aren't loading.
    const isReady = !isLoadingDetails || Object.keys(detailedProducts).length > 0;
    if (!isReady) return cart; // Return un-enhanced cart if loading

    return cart.map((item) => {
      const details = detailedProducts[item.item_id];

      return {
        ...item,
        image: details?.image ?? null,
        price: details?.price ?? null,
      };
    });
  }, [cart, detailedProducts, isLoadingDetails]); // Added isLoadingDetails

  // --- Render logic based on loading and cart state ---
  if (isLoadingDetails && cart.length > 0) {
    // Only show loading if we have items AND are fetching
    return (
      <div className="cart-loading-message">
        <HomeButton />
        <h2>Loading Cart Details...</h2>
        <p>Fetching product information...</p>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-empty-message">
        <HomeButton />
        <h2>Your Shopping Cart</h2>
        <p>Your cart is empty. Start adding some awesome products!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-home-btn-div">
        <HomeButton />
      </div>
      <h2 className="cart-page-sub-title">Your Shopping Cart</h2>

      <div className="cart-items-div">
        {cartWithDetails.map((item) => (
          <div key={item.id} className="cart-item">
            {item.image ? (
              <Link to={`/item/${item.item_id}`}>
                <img src={item.image} alt={item.title} className="cart-item-image" />
              </Link>
            ) : (
              <div className="cart-item-image-placeholder">No Image</div>
            )}

            <div className="cart-item-details">
              <h5 className="cart-item-title">{item.title}</h5>
              {item.price !== null && item.price !== undefined ? (
                <p className="cart-item-price">R{item.price.toFixed(2)}</p>
              ) : (
                <p className="cart-item-price">R--.--</p>
              )}

              <div className="cart-item-quantity-controls">
                <button onClick={() => addToCart(item)} className="quantity-btn add-btn">
                  +
                </button>
                <p className="cart-item-quantity">{item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.item_id)}
                  className="quantity-btn remove-btn"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>
          Total: R
          {cartWithDetails
            .reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
            .toFixed(2)}
        </h3>
        <div className="cart-page-clear-cheackout-btn-div">
          <button onClick={clearCart} className="clear-btn button-style-1">
            Clear cart
          </button>
          <button className="checkout-btn button-style-1">Checkout</button>
        </div>
      </div>
    </div>
  );
}
