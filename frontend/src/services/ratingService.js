import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/ratings" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const addRating = (data) => API.post("/add", data);