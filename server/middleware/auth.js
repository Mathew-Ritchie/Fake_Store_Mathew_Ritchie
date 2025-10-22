// middleware/auth.middleware.js

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for missing header or wrong format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Extract the token (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  // 2. Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    // 401 Unauthorized for expired, invalid signature, or malformed token
    if (err) {
      // It's good practice to send 401 here
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user; // { id: ..., email: ... }
    next();
  });
};
