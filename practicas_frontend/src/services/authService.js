import api from "./api";

const authService = {
  login: async (credentials) => {
    try {
      const tokenResponse = await api.post("/token/", credentials);

      if (!tokenResponse.data.access || !tokenResponse.data.refresh) {
        throw new Error("Tokens de autenticación inválidos");
      }

      localStorage.setItem("token", tokenResponse.data.access);
      localStorage.setItem("refresh_token", tokenResponse.data.refresh);

      const userResponse = await api.get("/usuarios/me/");

      return {
        ...tokenResponse.data,
        user: userResponse.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Error en la autenticación";
      throw new Error(errorMessage);
    }
  },

  refreshToken: async (refreshToken) => {
    if (!refreshToken) {
      throw new Error("No hay token de actualización disponible");
    }

    try {
      const response = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });

      if (!response.data.access) {
        throw new Error("Token de acceso inválido");
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "No se pudo refrescar el token";
      throw new Error(errorMessage);
    }
  },
};

export default authService;
