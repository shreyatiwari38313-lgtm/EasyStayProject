import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.model.js";

dotenv.config();

const setAdminRole = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    const email = "shreyatiwari38313@gmail.com";
    console.log(`🔍 Updating user with email: ${email}`);

    const result = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (result) {
      console.log("✅ User updated successfully:");
      console.log(`   Name: ${result.name}`);
      console.log(`   Email: ${result.email}`);
      console.log(`   Role: ${result.role}`);
    } else {
      console.log("❌ User not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

setAdminRole();
