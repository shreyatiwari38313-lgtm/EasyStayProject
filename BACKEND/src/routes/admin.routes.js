import express from "express";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
import User from "../models/User.model.js";
import Property from "../models/Property.model.js";

console.log("🔥 ADMIN ROUTE FILE EXECUTED"); //added

const router = express.Router();

console.log("📡 [ADMIN] Admin routes initialized");

/**
 * @route   GET /api/admin/dashboard
 * @desc    Admin dashboard welcome
 * @access  Private (Admin)
 */
router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin 🚀",
  });
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    console.log("📡 [ADMIN] /users endpoint called - User ID:", req.user?.id, "Role:", req.user?.role);
    const users = await User.find().select("-password");
    console.log("✅ [ADMIN] Found users:", users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ [ADMIN] Error fetching users:", error.message);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * @route   GET /api/admin/properties
 * @desc    Get all properties
 * @access  Private (Admin)
 */

router.get("/test", (req, res) => {
  console.log("📡 [ADMIN] /test endpoint called");
  res.send("Admin route working ✅");
});
router.get("/properties", protect, isAdmin, async (req, res) => {
  try {
    console.log("📡 [ADMIN] /properties called");

    const properties = await Property.find().populate("hostId");

    console.log("✅ Properties found:", properties.length);

    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching properties:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ default export (same as other routes)
export default router;



// import express from "express";
// import { protect, isAdmin } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Admin dashboard route
// router.get("/dashboard", protect, isAdmin, (req, res) => {
//   res.json({
//     message: "Welcome Admin 🚀",
//   });
// });

// // ✅ named export
// export { router as adminRoutes };