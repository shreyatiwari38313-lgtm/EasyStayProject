import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

/**
 * REGISTER
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 🔐 PASSWORD HASHING (HERE AS YOU ASKED)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax"
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax"
    })
    .status(201)
    .json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

/**
 * LOGIN
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax"
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax"
    })
    .json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

/**
 * LOGOUT
 */
export const logoutUser = async (req, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Logged out successfully" });
};

/**
 * CURRENT USER
 */
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id).select("-password");
  
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.json({
    success: true,
    message: "User fetched",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
