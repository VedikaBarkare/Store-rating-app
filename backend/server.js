import sequelize from "./config/db.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// MODELS
import User from "./models/user.model.js";
import Store from "./models/store.model.js";
import Rating from "./models/rating.model.js";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isLocalDevOrigin = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

// MIDDLEWARE
app.use(cors({
  origin(origin, callback) {
    if (!origin || isLocalDevOrigin(origin) || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);

// DATABASE CONNECTION
sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log("Database Error:", error);
  });


// DATABASE SYNC
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
