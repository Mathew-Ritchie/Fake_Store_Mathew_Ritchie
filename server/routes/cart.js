// routes/cart.js
import express from "express";
import { openDb } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware to verify JWT and set req.user
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains id and email
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET /api/cart - Get user's cart
router.get("/", authenticate, async (req, res) => {
  try {
    const db = await openDb();
    const cart = await db.all("SELECT * FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/cart - Add item to cart
router.post("/", authenticate, async (req, res) => {
  const { itemId, title, image, price } = req.body;
  if (!itemId) return res.status(400).json({ message: "Item ID required" });

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
      await db.run(
        "INSERT INTO cart (user_id, item_id, title, image, price) VALUES (?, ?, ?, ?, ?)",
        [req.user.id, itemId, title, image, price]
      );
    }

    const updatedCart = await db.all("SELECT * FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cart/:itemId - Remove one item from cart
router.delete("/:itemId", authenticate, async (req, res) => {
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
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete("/", authenticate, async (req, res) => {
  try {
    const db = await openDb();
    await db.run("DELETE FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ cart: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
