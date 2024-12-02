import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { asignarJurado } from "./moduloSlice";

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await api.get("/usuarios/");
  return response.data;
});

export const fetchUsersByRole = createAsyncThunk(
  "users/fetchUsersByRole",
  async (rol, { getState }) => {
    const token = getState().auth.token;
    const response = await api.get(`/usuarios/?rol=${rol}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async (userId) => {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    await api.delete(`/usuarios/${userId}/`);
    return userId;
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
        dni: userData.dni || "",
      };
      const response = await api.put(`/usuarios/${userData.id}/`, dataToSend);
      return response.data;
    } catch (error) {
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
    items: [],
    estudiantes: [],
    loading: false,
    status: "idle",
    error: null,
    updateStatus: "idle",
    updateError: null,
    selectedUser: null,
    deleteStatus: "idle",
    deleteError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(asignarJurado.fulfilled, (state, action) => {
        const juradoId = action.payload.jurado?.id;
        if (juradoId) {
          const juradoIndex = state.users.findIndex(
            (user) => user.id === juradoId
          );
          if (juradoIndex !== -1) {
            state.users[juradoIndex] = {
              ...state.users[juradoIndex],
              modulos_asignados: [
                ...(state.users[juradoIndex].modulos_asignados || []),
                action.payload.id,
              ],
            };
          }
        }
      })
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
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearErrors, clearSelectedUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
