import axios from "axios";

export const historyAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://homeservices-server.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request (axios.create() does NOT inherit global interceptors)
historyAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
