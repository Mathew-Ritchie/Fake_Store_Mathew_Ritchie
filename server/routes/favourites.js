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
