// favourites.controller.js

import { openDb } from "../db.js";

/**
 * GET /api/favourites - Get all favourites for logged-in user
 */
export const getFavourites = async (req, res) => {
  // req.user is set by the authenticate middleware
  try {
    const db = await openDb();
    const favourites = await db.all("SELECT * FROM favourites WHERE user_id = ?", [req.user.id]);
    res.json({ favourites });
  } catch (err) {
    console.error("Favourites GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/favourites - Add or remove favourite (toggle)
 */
export const toggleFavourite = async (req, res) => {
  const { itemId, title, image, price } = req.body;
  if (!itemId) return res.status(400).json({ message: "Item ID required" });

  try {
    const db = await openDb();

    // Check if already in favourites
    const existing = await db.get("SELECT * FROM favourites WHERE user_id = ? AND item_id = ?", [
      req.user.id,
      itemId,
    ]);

    if (existing) {
      // Remove if already a favourite
      await db.run("DELETE FROM favourites WHERE id = ?", [existing.id]);
    } else {
      // Add if not yet favourited
      await db.run("INSERT INTO favourites (user_id, item_id, title) VALUES (?, ?, ?)", [
        req.user.id,
        itemId,
        title,
      ]);
    }

    // Return updated list
    const favourites = await db.all("SELECT * FROM favourites WHERE user_id = ?", [req.user.id]);
    res.json({ favourites });
  } catch (err) {
    console.error("Favourites toggle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/favourites/:itemId - Remove single favourite
 */
export const removeFavourite = async (req, res) => {
  const { itemId } = req.params;

  try {
    const db = await openDb();
    await db.run("DELETE FROM favourites WHERE user_id = ? AND item_id = ?", [req.user.id, itemId]);

    // Return updated list
    const favourites = await db.all("SELECT * FROM favourites WHERE user_id = ?", [req.user.id]);
    res.json({ favourites });
  } catch (err) {
    console.error("Favourites DELETE by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/favourites - Clear all favourites
 */
export const clearFavourites = async (req, res) => {
  try {
    const db = await openDb();
    await db.run("DELETE FROM favourites WHERE user_id = ?", [req.user.id]);
    res.json({ favourites: [] });
  } catch (err) {
    console.error("Favourites clear error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
