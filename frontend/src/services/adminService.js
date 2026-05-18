import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/admin" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getDashboardData = () => API.get("/dashboard");
export const getAllUsers = (params) => API.get("/users", { params });
export const getAllStores = (params) => API.get("/stores", { params });
export const addUser = (data) => API.post("/users", data);
export const addStore = (data) => API.post("/stores", data);