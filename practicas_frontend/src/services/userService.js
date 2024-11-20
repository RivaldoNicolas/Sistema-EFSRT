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

  changePassword: async (passwordData) => {
    try {
      const response = await api.post("/usuarios/change_password/", {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
