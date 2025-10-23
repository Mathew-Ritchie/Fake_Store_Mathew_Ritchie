import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getCart,
  addItemToCart,
  removeItemUnitFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All routes use the authenticate middleware
router.get("/", authenticateToken, getCart);
router.post("/", authenticateToken, addItemToCart);
router.delete("/:itemId", authenticateToken, removeItemUnitFromCart);
router.delete("/", authenticateToken, clearCart);

export default router;
