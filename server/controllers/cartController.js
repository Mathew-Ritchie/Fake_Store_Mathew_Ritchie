// cart.controller.js

import { openDb } from "../db.js";

/**
 * GET /api/cart - Get user's cart
 */
export const getCart = async (req, res) => {
  // req.user is set by the authenticate middleware
  try {
    const db = await openDb();
    const cart = await db.all("SELECT * FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/cart - Add item to cart or increase quantity
 */
export const addItemToCart = async (req, res) => {
  const { itemId, title, image, price } = req.body;
  if (!itemId) return res.status(400).json({ message: "Item ID required" });

  const standardizedItemId = String(itemId).toLowerCase().trim();

  // 2. ✅ LOG THE DATA (using the defined variables)
  console.log(`[CART LOG] User ${req.user.id} attempting to add/update item: 
    {
      Original ID: "${itemId}",
      Standardized ID: "${standardizedItemId}",
      Title: "${title}",
      User Email: "${req.user.email}"
    }`);

  try {
    const db = await openDb();
    const existing = await db.get("SELECT * FROM cart WHERE user_id = ? AND item_id = ?", [
      req.user.id,
      itemId,
    ]);

    if (existing) {
      // Increase quantity if item already in cart
      await db.run("UPDATE cart SET quantity = quantity + 1 WHERE id = ?", [existing.id]);
    } else {
      // Insert new item with quantity = 1
      await db.run("INSERT INTO cart (user_id, item_id, title, quantity) VALUES ( ?, ?, ?, 1)", [
        req.user.id,
        itemId,
        title,
      ]);
    }

    const updatedCart = await db.all("SELECT * FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/cart/:itemId - Remove one item unit from cart (decrease quantity or remove)
 */
export const removeItemUnitFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const db = await openDb();
    const item = await db.get("SELECT * FROM cart WHERE user_id = ? AND item_id = ?", [
      req.user.id,
      itemId,
    ]);

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (item.quantity > 1) {
      // Decrease quantity by 1
      await db.run("UPDATE cart SET quantity = quantity - 1 WHERE id = ?", [item.id]);
    } else {
      // Remove item completely
      await db.run("DELETE FROM cart WHERE id = ?", [item.id]);
    }

    const updatedCart = await db.all("SELECT * FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/cart - Clear entire cart
 */
export const clearCart = async (req, res) => {
  try {
    const db = await openDb();
    await db.run("DELETE FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
