import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const updatePassword = (data) => API.put("/auth/update-password", data);
export const getProfile = () => API.get("/auth/profile");