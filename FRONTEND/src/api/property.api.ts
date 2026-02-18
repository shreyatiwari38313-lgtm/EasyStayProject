import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  city: string;
  pricePerNight: number;
  images: Array<{ url: string; public_id: string }>;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllProperties = async (): Promise<{ success: boolean; properties: Property[] }> => {
  try {
    const response = await API.get("/properties");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPropertyById = async (propertyId: string): Promise<{ success: boolean; property: Property }> => {
  try {
    const response = await API.get(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
