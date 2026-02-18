import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",     // use proxy -> avoids CORS in dev
  withCredentials: true,
});

export const login = (data: any) => api.post("/auth/login", data);
export default api;