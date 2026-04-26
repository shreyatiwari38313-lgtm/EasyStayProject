import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const hashPassword = async (password) => {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
};

console.log("MONGODB_URL:", process.env.MONGODB_URL);

const createAdmin = async () => {
   try {
      await mongoose.connect(process.env.MONGODB_URL);

      const adminExists = await User.findOne({ role: "admin" });

      if (adminExists) {
         console.log("Admin already exists");
         process.exit();
      }

       await User.create({
         name: "Admin",
         email: "shreyatiwari38313@gmail.com",
         password: "admin123", // ✅ plain password
         role: "admin"
      });

      console.log("Admin created successfully");
      process.exit();

   } catch (error) {
      console.error(error);
      process.exit(1);
   }
};

createAdmin();





























// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import User from "../src/models/User.model.js";
// import bcrypt from "bcryptjs";
// const hashPassword = async (password) => {
//    const salt = await bcrypt.genSalt(10);
//    return bcrypt.hash(password, salt);
// };

// dotenv.config();
// //
// console.log("MONGO_URI:", process.env.MONGO_URI);

// const createAdmin = async () => {
//    try {
//       await mongoose.connect(process.env.MONGO_URI);

//       const adminExists = await User.findOne({ role: "admin" });

//       if (adminExists) {
//          console.log("Admin already exists");
//          process.exit();
//       }

//       await User.create({
//          name: "Admin",
//          email: "shreyatiwari38313@gmail.com",
//          password: "admin123",
//          role: "admin"
//       });

//       console.log("Admin created successfully");
//       process.exit();

//    } catch (error) {
//       console.error(error);
//       process.exit(1);
//    }
// };

// createAdmin();