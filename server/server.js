import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import favouritesRoutes from "./routes/favourites.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Local client development URL
  process.env.NETLIFY_CLIENT_URL || "https://mathews-fake-store.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Use Express middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favourites", favouritesRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ status: "ok", message: "Server is awake 🚀" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
