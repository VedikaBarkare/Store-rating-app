import express from "express";
import { getDashboardData, getAllUsers, getAllStores, addUser, addStore } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardData);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/stores", protect, adminOnly, getAllStores);
router.post("/users", protect, adminOnly, addUser);
router.post("/stores", protect, adminOnly, addStore);

export default router;