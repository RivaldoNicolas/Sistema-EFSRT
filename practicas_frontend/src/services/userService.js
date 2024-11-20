import api from "./api";

const userService = {
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/usuarios/${userId}/`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
