import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    refreshTokenSuccess: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    },

    updateUserProfile: (state, action) => {
      const updatedUser = {
        ...state.user,
        ...action.payload,
        estudiante_data: {
          ...state.user?.estudiante_data,
          ...action.payload?.estudiante_data,
        },
      };
      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
  },
});

export const { loginSuccess, refreshTokenSuccess, logout, updateUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
