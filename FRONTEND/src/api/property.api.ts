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
  address: {
    city: string;
    country: string;
  };
  pricePerNight: number;
  images: Array<{ url: string }>;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: any[];
  averageRating: number;
  totalReviews: number;
  hostId: any;
}

// ✅ FIXED RESPONSE TYPES
export const getAllProperties = async () => {
  const response = await API.get("/properties?limit=100");
  // 🔥 IMPORTANT FIX
  return response.data.properties || [];
};

export const getPropertyById = async (propertyId: string) => {
  const response = await API.get(`/properties/${propertyId}`);
  return response.data.property;
};







// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000/api/v1",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add access token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export interface Property {
//   _id: string;
//   title: string;
//   description: string;
//   propertyType: string;
//   city: string;
//   pricePerNight: number;
//   images: Array<{ url: string; public_id: string }>;
//   bedrooms: number;
//   bathrooms: number;
//   maxGuests: number;
//   amenities: string[];
//   status: "pending" | "approved" | "rejected";
//   isActive: boolean;
//   hostId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export const getAllProperties = async (): Promise<{ success: boolean; properties: Property[] }> => {
//   try {
//     const response = await API.get("/properties");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getPropertyById = async (propertyId: string): Promise<{ success: boolean; property: Property }> => {
//   try {
//     const response = await API.get(`/properties/${propertyId}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
