import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  let token = Cookies.get("token"); // Try to get token from cookies
  if (!token) {
    token = sessionStorage.getItem("token") || undefined; // Fallback to sessionStorage if not in cookies
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
