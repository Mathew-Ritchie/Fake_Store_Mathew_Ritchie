import express from "express";
// Import the middleware from the new dedicated file
import { authenticateToken } from "../middleware/auth.js";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

// Route definitions
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
