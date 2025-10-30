import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../GlobalStore/useCartStore";
import { useUserStore } from "../GlobalStore/useUserStore";
import useProductsStore from "../GlobalStore/useProductStore";

export default function CartContents() {
  const { cart, fetchCart, addToCart, removeFromCart } = useCartStore();
  const user = useUserStore((state) => state.user);
  const { fetchProductInfo } = useProductsStore();

  const [detailedProducts, setDetailedProducts] = useState({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // --- Fetch user's cart ---
  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // --- Fetch details for each cart item ---
  useEffect(() => {
    if (cart.length === 0) {
      setDetailedProducts({});
      return;
    }

    const itemsToFetch = cart.filter((item) => !detailedProducts[item.item_id]);
    const uniqueIds = [...new Set(itemsToFetch.map((i) => i.item_id))];

    if (uniqueIds.length === 0) return;

    setIsLoadingDetails(true);

    const fetchAllDetails = async () => {
      const newDetails = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const info = await fetchProductInfo(id);
            newDetails[id] = info
              ? { image: info.image, price: info.price }
              : { image: null, price: null };
          } catch (error) {
            console.error(`Failed to fetch details for ${id}:`, error);
            newDetails[id] = { image: null, price: null };
          }
        })
      );
      setDetailedProducts((prev) => ({ ...prev, ...newDetails }));
      setIsLoadingDetails(false);
    };

    fetchAllDetails();
  }, [cart, fetchProductInfo]);

  // --- Merge product details into cart ---
  const cartWithDetails = useMemo(() => {
    if (!cart?.length) return [];
    return cart.map((item) => ({
      ...item,
      image: detailedProducts[item.item_id]?.image ?? null,
      price: detailedProducts[item.item_id]?.price ?? null,
    }));
  }, [cart, detailedProducts]);

  // --- Loading state ---
  if (isLoadingDetails && cart.length > 0) {
    return (
      <div className="cart-loading-message text-center py-10">
        <h3>Loading Cart Details...</h3>
        <p>Fetching product information...</p>
      </div>
    );
  }

  // --- Empty cart state ---
  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Your cart is empty. Start adding some awesome products!</p>
      </div>
    );
  }

  // --- Cart display ---
  const total = cartWithDetails.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="cart-items-wrapper w-full sm:w-[500px] bg-white">
      {cartWithDetails.map((item) => (
        <div key={item.id} className="cart-item border-b border-gray-300 py-4 px-4 flex gap-4">
          {item.image ? (
            <Link to={`/item/${item.item_id}`}>
              <img src={item.image} alt={item.title} className="w-24 h-24 object-contain" />
            </Link>
          ) : (
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-sm">
              No Image
            </div>
          )}

          <div className="flex flex-col justify-between flex-1">
            <h5 className="font-medium">{item.title}</h5>
            <p className="text-gray-600">R{item.price?.toFixed(2) ?? "--.--"}</p>

            <div className="flex items-center justify-end gap-2">
              <button onClick={() => addToCart(item)} className="quantity-btn text-lg w-6">
                +
              </button>
              <p className="w-6 text-center">{item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.item_id)}
                className="quantity-btn text-lg w-6"
              >
                -
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="cart-total text-end p-4">
        <h3 className="font-semibold text-lg">Total: R{total.toFixed(2)}</h3>
      </div>
    </div>
  );
}
