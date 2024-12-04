import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async Thunks
export const fetchPracticasAsignadas = createAsyncThunk(
  "jurado/fetchPracticas",
  async (_, { getState }) => {
    const { user } = getState().auth;
    const response = await api.get(`/practicas/?jurado=${user.id}`);
    return response.data;
  }
);

export const fetchEvaluaciones = createAsyncThunk(
  "jurado/fetchEvaluaciones",
  async () => {
    const response = await api.get("/evaluaciones/");
    return response.data;
  }
);

export const submitEvaluacion = createAsyncThunk(
  "jurado/submitEvaluacion",
  async (evaluacionData) => {
    const response = await api.post(
      "/evaluaciones/evaluar_modulo/",
      evaluacionData
    );
    return response.data;
  }
);

export const updateEvaluacion = createAsyncThunk(
  "jurado/updateEvaluacion",
  async ({ id, data }) => {
    const response = await api.put(`/evaluaciones/${id}/`, data);
    return response.data;
  }
);

export const deleteEvaluacion = createAsyncThunk(
  "jurado/deleteEvaluacion",
  async (id) => {
    await api.delete(`/evaluaciones/${id}/`);
    return id;
  }
);

const juradoSlice = createSlice({
  name: "jurado",
  initialState: {
    practicas: [],
    evaluaciones: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Prácticas
      .addCase(fetchPracticasAsignadas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPracticasAsignadas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.practicas = action.payload;
      })
      .addCase(fetchPracticasAsignadas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Evaluaciones
      .addCase(fetchEvaluaciones.fulfilled, (state, action) => {
        state.evaluaciones = action.payload;
      })
      // Submit Evaluación
      .addCase(submitEvaluacion.fulfilled, (state, action) => {
        state.evaluaciones.push(action.payload);
      })
      // Update Evaluación
      .addCase(updateEvaluacion.fulfilled, (state, action) => {
        const index = state.evaluaciones.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.evaluaciones[index] = action.payload;
        }
      })
      // Delete Evaluación
      .addCase(deleteEvaluacion.fulfilled, (state, action) => {
        state.evaluaciones = state.evaluaciones.filter(
          (e) => e.id !== action.payload
        );
      });
  },
});

export const { clearError } = juradoSlice.actions;
export default juradoSlice.reducer;
