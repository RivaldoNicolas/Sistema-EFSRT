import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersByRole } from "./userSlice";
import axios from "axios";

export const createEstudiante = createAsyncThunk(
  "estudiantes/createEstudiante",
  async (estudianteData) => {
    const response = await axios.post("/api/estudiantes/", estudianteData);
    return response.data;
  }
);

const estudiantesSlice = createSlice({
  name: "estudiantes",
  initialState: {
    estudiantes: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Existing cases
      .addCase(fetchUsersByRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.estudiantes = action.payload.filter(
          (user) => user.rol === "ESTUDIANTE"
        );
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // New cases for createEstudiante
      .addCase(createEstudiante.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEstudiante.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.estudiantes.push(action.payload);
      })
      .addCase(createEstudiante.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default estudiantesSlice.reducer;
