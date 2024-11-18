// services/authService.js
import api from "./api";

const authService = {
  login: async (credentials) => {
    try {
      // Obtener token
      const tokenResponse = await api.post("/token/", credentials);
      localStorage.setItem("token", tokenResponse.data.access);
      localStorage.setItem("refresh_token", tokenResponse.data.refresh); // Guardar el token de actualización

      // Obtener datos del usuario
      const userResponse = await api.get("/usuarios/me/");
      return {
        ...tokenResponse.data,
        user: userResponse.data,
      };
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error en la autenticación"
        );
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw new Error("No se pudo refrescar el token");
    }
  },
};

export default authService;
