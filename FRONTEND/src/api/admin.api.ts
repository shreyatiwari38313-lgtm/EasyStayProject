import axios from "axios";

// 🔹 Base URL of your backend
const BASE_URL = "http://localhost:8000/api/v1/admin";

// 🔹 Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * ✅ Get all users (Admin only)
 */
export const getUsers = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/users`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * ✅ Get all properties (Admin only)
 */
export const getProperties = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/properties`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching properties:", error?.response?.data || error.message);
    throw error;
  }
};