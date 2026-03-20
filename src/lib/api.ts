import axios from "axios";

const apiBaseUrlRaw = process.env.NEXT_PUBLIC_API_URL as string;
const apiBaseUrl = apiBaseUrlRaw.endsWith("/")
  ? apiBaseUrlRaw.slice(0, -1)
  : apiBaseUrlRaw;

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;