import axios from "axios";

export const historyAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://homeservices-server.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
