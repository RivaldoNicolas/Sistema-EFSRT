import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersByRole } from "./userSlice"; // Importa la función desde userSlice.js

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
      });
  },
});

export default estudiantesSlice.reducer;
