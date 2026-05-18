import express from "express";
import { createStore, getAllStores, getOwnerStores, getUserRatings } from "../controllers/store.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/create", protect, adminOnly, createStore);
router.get("/", protect, getAllStores);
router.get("/owner", protect, getOwnerStores);
router.get("/my-ratings", protect, getUserRatings);

export default router;