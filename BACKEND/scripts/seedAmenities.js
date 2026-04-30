import mongoose from "mongoose";
import dotenv from "dotenv";
import Amenity from "../src/models/Amenity.model.js";

dotenv.config();

const amenities = [
  "WiFi",
  "Free Parking",
  "Kitchen",
  "AC",
  "Swimming Pool",
  "TV",
  "Refrigerator",
  "Air Conditioning",
  "Hot Water",
  "Dining Area",
];

const seedAmenities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    for (const name of amenities) {
      await Amenity.updateOne(
        { name },
        { name },
        { upsert: true }
      );
    }

    console.log("✅ Amenities seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAmenities();