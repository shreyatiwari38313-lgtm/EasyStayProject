import Booking from "../models/Booking.model.js";
import Property from "../models/Property.model.js";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";


const router = express.Router();

/* =====================================
   CREATE BOOKING
===================================== */
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    // Mandatory validation
    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "propertyId, checkIn and checkOut are required",
      });
    }

    // Validate propertyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format. Please use a valid property from the database.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property || !property.isActive || property.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Property not available for booking",
      });
    }

    // Check date overlap
    const existingBooking = await Booking.findOne({
      propertyId,
      status: { $in: ["confirmed", "pending"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Property already booked for selected dates",
      });
    }

    const days =
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    const totalPrice = days * property.pricePerNight;

    const booking = await Booking.create({
      userId: req.user.id,
      propertyId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   GET MY BOOKINGS (USER)
===================================== */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("propertyId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   GET BOOKING BY ID
===================================== */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("propertyId")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   CANCEL BOOKING
===================================== */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (
      req.user?.role !== "admin" &&
      booking.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();

    const updated = await booking.save();
    return res.json(updated);

  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   ADMIN: GET ALL BOOKINGS
===================================== */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("propertyId", "title");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   GET BOOKINGS (ROLE BASED)
===================================== */
export const getBookings = async (req, res) => {
  try {
    const filter =
      req.user?.role === "admin"
        ? {}
        : { userId: req.user.id };

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 });

    return res.json(bookings);

  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   DELETE BOOKING
===================================== */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (
      req.user?.role !== "admin" &&
      booking.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Booking.findByIdAndDelete(id);
    return res.status(200).json({ message: "Booking deleted" });

  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   UPDATE BOOKING
===================================== */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (
      req.user?.role !== "admin" &&
      booking.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { checkIn, checkOut, guests, status } = req.body;

    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);
    if (guests !== undefined) booking.guests = guests;
    if (status) booking.status = status;

    const updated = await booking.save();
    return res.json(updated);

  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   ADMIN: UPDATE BOOKING STATUS
===================================== */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status)
      return res.status(400).json({ message: "Status is required" });

    const allowed = [
      "pending",
      "confirmed",
      "checked_in",
      "completed",
      "cancelled",
    ];

    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const booking = await Booking.findById(id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = status;

    if (status === "cancelled")
      booking.cancelledAt = new Date();

    const updated = await booking.save();
    return res.json(updated);

  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// keep your existing route handlers — example safe handlers below
router.post("/", async (req, res) => {
  try {
    const { propertyId, startDate, endDate, guests } = req.body;
    const booking = { id: String(Date.now()), propertyId, startDate, endDate, guests, status: "pending" };
    // TODO: persist booking to DB
    return res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Booking creation failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // TODO: fetch from DB
    return res.json({ id: req.params.id, status: "pending" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch booking" });
  }
});

export default router;
