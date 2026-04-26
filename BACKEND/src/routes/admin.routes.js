import express from "express";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin dashboard route
router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin 🚀",
  });
});

// ✅ named export
export { router as adminRoutes };