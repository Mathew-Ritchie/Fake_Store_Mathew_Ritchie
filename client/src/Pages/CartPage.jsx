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
    if (!user) return;
    fetchCart();
  }, [user]);

  useEffect(() => {
    if (cart.length === 0) {
      setDetailedProducts({});
      return;
    }

    const itemsToFetch = cart.filter((item) => !detailedProducts[item.item_id]);
    const uniqueItemIds = [...new Set(itemsToFetch.map((item) => item.item_id))];

    if (uniqueItemIds.length === 0) {
      setIsLoadingDetails(false);
      return;
    }

    setIsLoadingDetails(true);

    const fetchAllDetails = async () => {
      const newDetails = {};

      const productPromises = uniqueItemIds.map(async (itemId) => {
        try {
          const info = await fetchProductInfo(itemId);
          newDetails[itemId] = info
            ? { image: info.image, price: info.price }
            : { image: null, price: null };
        } catch (error) {
          console.error(`Failed to fetch details for item ${itemId}:`, error);
          newDetails[itemId] = { image: null, price: null };
        }
      });

      await Promise.all(productPromises);

      // ✅ Merge safely without retriggering
      setDetailedProducts((prev) => {
        const merged = { ...prev, ...newDetails };
        return merged;
      });

      setIsLoadingDetails(false);
    };

    fetchAllDetails();

    // Cleanup not strictly necessary here
  }, [cart, fetchProductInfo]); // ✅ removed detailedProducts

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
      <div className="w-full">
        <div className="w-full bg-gray-600">
          <HomeButton />
        </div>
        <h2 className="text-center">Your Shopping Cart</h2>
        <p className="text-center">Your cart is empty. Start adding some awesome products!</p>
      </div>
    );
  }

  return (
    <div className="cart-container bg-gray-100 w-full flex flex-col items-center">
      <HomeButton />

      <h2 className="cart-page-sub-title text-center w-full sm:w-[500px] bg-white py-8 text-3xl">
        Your Shopping Cart
      </h2>

      <div className="cart-items-div w-full sm:w-[500px] bg-white">
        {cartWithDetails.map((item) => (
          <div key={item.id} className="cart-item border-b-2 border-gray-300 py-4 px-4">
            {item.image ? (
              <Link to={`/item/${item.item_id}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image w-24 h-24 object-contain"
                />
              </Link>
            ) : (
              <div className="cart-item-image-placeholder">No Image</div>
            )}

            <div className="cart-item-details">
              <h5 className="cart-item-title m-0">{item.title}</h5>
              {item.price !== null && item.price !== undefined ? (
                <p className="cart-item-price m-0">R{item.price.toFixed(2)}</p>
              ) : (
                <p className="cart-item-price m-0">R--.--</p>
              )}

              <div className="cart-item-quantity-controls flex items-center justify-end">
                <button
                  onClick={() => addToCart(item)}
                  className="quantity-btn add-btn text-lg  w-2.5"
                >
                  +
                </button>
                <p className="cart-item-quantity w-6 h-6 text-center">{item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.item_id)}
                  className="quantity-btn remove-btn text-lg  w-2.5"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total text-end pr-4 py-4">
        <h3>
          Total: R
          {cartWithDetails
            .reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
            .toFixed(2)}
        </h3>
        <div className="cart-page-clear-cheackout-btn-div">
          <button onClick={clearCart} className="clear-btn button-style-1 bg-red-800">
            Clear cart
          </button>
          <button className="checkout-btn button-style-1">Checkout</button>
        </div>
      </div>
    </div>
  );
}
