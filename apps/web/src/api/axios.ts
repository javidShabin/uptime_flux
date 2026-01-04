import axios from "axios";
import { getToken, clearToken } from "../utils/token";

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && token.trim()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
