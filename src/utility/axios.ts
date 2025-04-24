import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Get token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
