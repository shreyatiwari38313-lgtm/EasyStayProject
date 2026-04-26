import express from "express";
import Wishlist from "../models/Wishlist.model.js";

const router = express.Router();

// ADD TO WISHLIST
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming:", req.body);

    const { propertyId } = req.body;

    // ❗ SAFETY CHECK
    if (!propertyId) {
      return res.status(400).json({ error: "propertyId is required" });
    }

    // ✅ SAFE duplicate check
    const exists = await Wishlist.findOne({ propertyId: propertyId });

    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    // ✅ Directly use req.body (clean + safe)
    const newItem = new Wishlist(req.body);

    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL WISHLIST ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Wishlist.find();
    res.status(200).json(items);
  } catch (err) {
    console.error("❌ GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE FROM WISHLIST
router.delete("/:id", async (req, res) => {
  try {
    const item = await Wishlist.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;