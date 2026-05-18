import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/stores" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const createStore = (data) => API.post("/create", data);
export const getAllStores = () => API.get("/");
export const getOwnerStores = () => API.get("/owner");
export const getMyRatings = () => API.get("/my-ratings");