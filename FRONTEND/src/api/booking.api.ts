import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const bookingAPI = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
bookingAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createBooking = async (bookingData: {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  guests?: number;
}) => {
  try {
    const response = await bookingAPI.post("/bookings", {
      ...bookingData,
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyBookings = async () => {
  try {
    const response = await bookingAPI.get("/bookings/my/bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const response = await bookingAPI.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const response = await bookingAPI.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (
  bookingId: string,
  bookingData: {
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
    status?: string;
  }
) => {
  try {
    const payload = {
      ...bookingData,
      ...(bookingData.checkIn && { checkIn: bookingData.checkIn.toISOString() }),
      ...(bookingData.checkOut && { checkOut: bookingData.checkOut.toISOString() }),
    };
    const response = await bookingAPI.patch(`/bookings/${bookingId}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "confirmed" | "checked_in" | "completed" | "cancelled"
) => {
  try {
    const response = await bookingAPI.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const response = await bookingAPI.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await bookingAPI.get("/bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};
