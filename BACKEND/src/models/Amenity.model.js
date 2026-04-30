import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    icon: {
      type: String, // optional (for future use)
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Amenity", amenitySchema);