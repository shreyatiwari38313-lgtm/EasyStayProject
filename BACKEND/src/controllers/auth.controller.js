import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

/**
 * REGISTER
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // ❌ DO NOT hash here
  // ✅ model pre-save hook will hash password
  const user = await User.create({
    name,
    email,
    password,
    role: role || "guest",
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * LOGIN
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 👇 YAHAN ADD KARO
   console.log("Entered Email:", email);
  console.log("Entered Password:", password);

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // 👇 YAHAN ADD KARO
   console.log("Stored Password:", user.password);

  const isPasswordValid = await user.isPasswordCorrect(password);

  // 👇 YAHAN ADD KARO
   console.log("Password Match:", isPasswordValid);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * REFRESH TOKEN
 */
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newAccessToken = user.generateAccessToken();

  res.json({ success: true, accessToken: newAccessToken });
});

/**
 * LOGOUT
 */
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default {
  register,
  login,
  refresh,
  logout,
};
