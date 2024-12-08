import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch prácticas asignadas al docente
export const fetchPracticasJurados = createAsyncThunk(
  "jurados/fetchPracticas",
  async (_, { getState }) => {
    const { user } = getState().auth;
    console.log("Usuario actual:", user);
    const response = await api.get(`/practicas/?jurado=${user.id}`);
    console.log("Respuesta API:", response.data);
    return response.data;
  }
);

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
    try {
      console.log("Request Data:", evaluacionData);
      const response = await api.post(
        "/evaluaciones/evaluar_practica/",
        evaluacionData
      );
      return response.data;
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      throw new Error(
        error.response?.data?.error || "Error al enviar evaluación"
      );
    }
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
    loading: false,
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
      .addCase(fetchPracticasJurados.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPracticasJurados.fulfilled, (state, action) => {
        state.loading = false;
        state.practicas = action.payload;
        state.error = null;
      })
      .addCase(fetchPracticasJurados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

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
      .addCase(submitEvaluacion.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // Fetch Evaluaciones
      .addCase(fetchEvaluaciones.fulfilled, (state, action) => {
        state.evaluaciones = action.payload;
      })
      // Submit Evaluación
      .addCase(submitEvaluacion.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.evaluaciones.push(action.payload);
        // Update the práctica in the list with new evaluation
        const practicaIndex = state.practicas.findIndex(
          (p) => p.id === action.payload.practica_id
        );
        if (practicaIndex !== -1) {
          state.practicas[practicaIndex].nota_final =
            action.payload.calificacion;
          state.practicas[practicaIndex].estado = "EVALUADO";
        }
      })
      .addCase(submitEvaluacion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
