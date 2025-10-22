// auth.controller.js

import { openDb } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Controller for registering a new user.
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const db = await openDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Controller for user login.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Controller for getting the current logged-in user.
 */
export const getCurrentUser = async (req, res) => {
  // req.user is set by the authenticateToken middleware
  try {
    const db = await openDb();
    const user = await db.get("SELECT id, username, email FROM users WHERE id = ?", [req.user.id]);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
