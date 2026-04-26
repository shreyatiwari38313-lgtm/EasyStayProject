import axios from "axios";

/**
 * Axios instance
 */
const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token automatically to protected routes
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   console.log("🔗 [AXIOS] Request config:", {
//     url: config.url,
//     method: config.method,
//     baseURL: config.baseURL,
//     headers: config.headers
//   });
//   return config;
// }, (error) => {
//   console.error("❌ [AXIOS] Request interceptor error:", error);
//   return Promise.reject(error);
// });

// // Add response interceptor for better error handling
// API.interceptors.response.use(
//   (response) => {
//     console.log("✅ [AXIOS] Response received:", response.status, response.data);
//     return response;
//   },
//   (error) => {
//     console.error("❌ [AXIOS] Response error:", {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message,
//       isNetwork: error.code === 'ERR_NETWORK' || error.message === 'Network Error'
//     });
//     return Promise.reject(error);
//   }
// );


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // ❗ login & register ke liye token mat bhejo
    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug log
    console.log("🔗 [AXIOS] Request config:", {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("❌ [AXIOS] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor (same as yours, just clean)
API.interceptors.response.use(
  (response) => {
    console.log("✅ [AXIOS] Response:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ [AXIOS] Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

/**
 * Types
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "guest" | "host";
}

export interface AuthResponse {
  success?: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: "guest" | "host";
  };
  accessToken?: string;
  refreshToken?: string;
}

/**
 * REGISTER USER
 */
export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  try {
    console.log("🚀 [FRONTEND] Registering user with payload:", payload);
    console.log("🌐 [FRONTEND] Sending POST to:", "http://localhost:8000/api/v1/auth/register");
    
    const response = await API.post<AuthResponse>("/auth/register", payload);
    console.log("✅ [FRONTEND] Registration successful:", response.data);

    // Save tokens
    if (response.data.accessToken) localStorage.setItem("accessToken", response.data.accessToken);
    if (response.data.refreshToken) localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  } catch (error: any) {
    console.error("❌ [FRONTEND] Registration error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    throw error.response?.data || { message: error.message || "Registration failed" };
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (
  payload: { email: string; password: string }
): Promise<AuthResponse> => {
  try {
    console.log("🚀 [FRONTEND] Logging in with email:", payload.email);
    const response = await API.post<AuthResponse>("/auth/login", payload);
    console.log("✅ [FRONTEND] Login successful:", response.data);
    console.log("📊 [FRONTEND] Response user object:", response.data.user);
    console.log("📊 [FRONTEND] Response user role:", response.data.user?.role);

    // Save tokens
    if (response.data.accessToken) localStorage.setItem("accessToken", response.data.accessToken);
    if (response.data.refreshToken) localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data;
  } catch (error: any) {
    console.error("❌ [FRONTEND] Login error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    const errorMessage = error.response?.data?.message || error.message || "Login failed";
    throw { 
      message: errorMessage,
      data: error.response?.data
    };
  }
};

/**
 * LOGOUT USER
 */
export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    const response = await API.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return response.data;
  } catch {
    throw { message: "Logout failed" };
  }
};

/**
 * GET CURRENT USER (Protected Route)
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await API.get<AuthResponse>("/users/me");
    return response.data;
  } catch {
    throw { message: "Unauthorized" };
  }
};

/**
 * REFRESH TOKEN (Optional)
 */
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  try {
    const token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("No refresh token found");

    const response = await API.post<{ accessToken: string }>("/auth/refresh", { refreshToken: token });
    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data;
  } catch {
    throw { message: "Token refresh failed" };
  }
};
