import axios from "axios";
import authService from "./authService";
import { store } from "../redux/store";
import { logout, refreshTokenSuccess } from "../redux/slices/authSlice";
import { showAlert } from "../redux/slices/alertSlice";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 400 Bad Request errors
    if (error.response?.status === 400) {
      const errorMessage =
        error.response.data?.message ||
        Object.values(error.response.data)[0]?.[0] ||
        "Error en la solicitud";

      store.dispatch(
        showAlert({
          type: "error",
          message: errorMessage,
        })
      );

      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await authService.refreshToken(refreshToken);

        localStorage.setItem("token", response.access);
        store.dispatch(refreshTokenSuccess(response.access));

        api.defaults.headers.Authorization = `Bearer ${response.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
