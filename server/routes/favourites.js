// import express from "express";
// import { openDb } from "../db.js";
// import jwt from "jsonwebtoken";

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// // Middleware for auth
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: "Missing token" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// //  Get all favourites for logged-in user
// router.get("/", authenticate, async (req, res) => {
//   try {
//     const db = await openDb();
//     const favourites = await db.all("SELECT * FROM favourites WHERE user_id = ?", [req.user.id]);
//     res.json({ favourites });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //  Add or remove favourite (toggle)
// router.post("/", authenticate, async (req, res) => {
//   const { itemId, title, image, price } = req.body;
//   if (!itemId) return res.status(400).json({ message: "Item ID required" });

//   try {
//     const db = await openDb();
//     console.log("Adding favourite for user:", req.user, "with itemId:", itemId);
//     // Check if already in favourites
//     const existing = await db.get("SELECT * FROM favourites WHERE user_id = ? AND item_id = ?", [
//       req.user.id,
//       itemId,
//     ]);

//     if (existing) {
//       // Remove if already a favourite
//       await db.run("DELETE FROM favourites WHERE id = ?", [existing.id]);
//     } else {
//       // Add if not yet favourited
//       await db.run(
//         "INSERT INTO favourites (user_id, item_id, title, image, price) VALUES (?, ?, ?, ?, ?)",
//         [req.user.id, itemId, title, image, price]
//       );
//     }

//     // Return updated list
//     const favourites = await db.all("SELECT * FROM favourites WHERE user_id = ?", [req.user.id]);
//     res.json({ favourites });
//   } catch (err) {
//     console.error(" Favourites toggle error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //  Remove single favourite
// router.delete("/:itemId", authenticate, async (req, res) => {
//   const { itemId } = req.params;

//   try {
//     const db = await openDb();
//     await db.run("DELETE FROM favourites WHERE user_id = ? AND item_id = ?", [req.user.id, itemId]);

//     const favourites = await db.all("SELECT * FROM favourites WHERE user_id = ?", [req.user.id]);
//     res.json({ favourites });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //  Clear all favourites
// router.delete("/", authenticate, async (req, res) => {
//   try {
//     const db = await openDb();
//     await db.run("DELETE FROM favourites WHERE user_id = ?", [req.user.id]);
//     res.json({ favourites: [] });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

// favourites.routes.js

import express from "express";
// Assuming you are importing your reusable middleware
import { authenticateToken } from "../middleware/auth.js";
import {
  getFavourites,
  toggleFavourite,
  removeFavourite,
  clearFavourites,
} from "../controllers/favouritesController.js";

const router = express.Router();

// Get all favourites
router.get("/", authenticateToken, getFavourites);

// Add or remove favourite (toggle)
router.post("/", authenticateToken, toggleFavourite);

// Remove single favourite
router.delete("/:itemId", authenticateToken, removeFavourite);

// Clear all favourites (DELETE /api/favourites)
router.delete("/", authenticateToken, clearFavourites);

export default router;
