import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../services/api";

export const fetchUsersByRole = createAsyncThunk(
  "users/fetchByRole",
  async (rol) => {
    const response = await axios.get(
      `http://localhost:8000/api/usuarios/?rol=${rol}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const dataToSend = {
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        telefono: userData.telefono || "",
        direccion: userData.direccion || "",
        edad: userData.edad ? parseInt(userData.edad) : null,
        rol: userData.rol,
      };

      console.log("Datos a enviar:", dataToSend);
      const response = await api.put(`/usuarios/${userData.id}/`, dataToSend);
      return response.data;
    } catch (error) {
      console.log("Error del servidor:", error.response?.data);
      return rejectWithValue(
        error.response?.data || "Error en la actualización"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
    updateStatus: "idle",
    updateError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      });
  },
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;

//el password en el bakend tiene que ser opcional recuerdene para despues
