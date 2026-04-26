import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.model.js";

dotenv.config();

const checkDuplicateUsers = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    const email = "shreyatiwari38313@gmail.com";
    console.log(`\n🔍 Searching for all users with email: ${email}\n`);

    const users = await User.find({ email });

    if (users.length === 0) {
      console.log("❌ No users found with this email");
    } else if (users.length === 1) {
      console.log("✅ Found 1 user:");
      users.forEach((u) => {
        console.log(`   ID: ${u._id}`);
        console.log(`   Name: ${u.name}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role}`);
      });
    } else {
      console.log(`⚠️ Found ${users.length} users with the same email!\n`);
      users.forEach((u, i) => {
        console.log(`User ${i + 1}:`);
        console.log(`   ID: ${u._id}`);
        console.log(`   Name: ${u.name}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role}`);
        console.log("");
      });

      console.log("🗑️ Deleting duplicate users (keeping the admin one)...");
      const adminUser = users.find((u) => u.role === "admin");
      if (adminUser) {
        const nonAdminUsers = users.filter((u) => u._id.toString() !== adminUser._id.toString());
        for (const user of nonAdminUsers) {
          await User.deleteOne({ _id: user._id });
          console.log(`   Deleted user: ${user._id} (${user.role})`);
        }
        console.log("✅ Cleanup complete!");
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkDuplicateUsers();
