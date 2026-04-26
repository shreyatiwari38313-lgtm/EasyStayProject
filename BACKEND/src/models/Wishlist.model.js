import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
  },
  title: String,
  location: String,
  price: Number,
  image: String,
  type: String,
  bedrooms: Number,
  guests: Number,
});

export default mongoose.model("Wishlist", wishlistSchema);