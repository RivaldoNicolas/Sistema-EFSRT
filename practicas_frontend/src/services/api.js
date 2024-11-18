// api.js
import axios from "axios";
import authService from "./authService";
import { store } from "../redux/store";
import { logout, refreshTokenSuccess } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar la respuesta de error y refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verificar si el error es por token expirado y evitar un bucle de reintentos
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Solicitar nuevo token de acceso usando el token de actualización
        const response = await authService.refreshToken(refreshToken);

        // Guardar el nuevo token y actualizar el estado de autenticación
        localStorage.setItem("token", response.access);
        store.dispatch(refreshTokenSuccess(response.access));

        // Actualizar el header de Authorization y reintentar la solicitud original
        api.defaults.headers.Authorization = `Bearer ${response.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresco falla, cerrar sesión y redirigir al login
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
