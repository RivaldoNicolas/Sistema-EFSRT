import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch prácticas asignadas al docente
export const fetchPracticasDocente = createAsyncThunk(
  "docente/fetchPracticas",
  async (_, { getState }) => {
    const { user } = getState().auth;
    console.log("Usuario actual:", user);
    const response = await api.get(`/practicas/?supervisor=${user.id}`);
    console.log("Respuesta API:", response.data);
    return response.data;
  }
);

// Registrar asistencia
export const registrarAsistencia = createAsyncThunk(
  "docente/registrarAsistencia",
  async (asistenciaData) => {
    const response = await api.post("/asistencias/", asistenciaData);
    return response.data;
  }
);

// Obtener asistencias de una práctica
// Example of how the thunk might be set up
export const fetchAsistenciasPractica = createAsyncThunk(
  "docente/fetchAsistenciasPractica",
  async (practiceId) => {
    const response = await api.get(`/asistencias/?practica=${practiceId}`);
    return response.data;
  }
);

// Evaluar informe
export const evaluarInforme = createAsyncThunk(
  "docente/evaluarInforme",
  async ({ informeId, evaluacionData }) => {
    const response = await api.post(
      `/informes/${informeId}/evaluar_informe/`,
      evaluacionData
    );
    return response.data;
  }
);

// Ver informes de práctica
export const fetchInformesPractica = createAsyncThunk(
  "docente/fetchInformes",
  async (practicaId) => {
    const response = await api.get(`/informes/?practica=${practicaId}`);
    return response.data;
  }
);

const docenteSlice = createSlice({
  name: "docente",
  initialState: {
    practicas: [],
    asistencias: [],
    informes: [],
    loading: false,
    error: null,
    selectedPractica: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPractica: (state, action) => {
      state.selectedPractica = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Prácticas
      .addCase(fetchPracticasDocente.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPracticasDocente.fulfilled, (state, action) => {
        state.loading = false;
        state.practicas = action.payload;
        state.error = null;
      })
      .addCase(fetchPracticasDocente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Registrar Asistencia
      .addCase(registrarAsistencia.pending, (state) => {
        state.loading = true;
      })
      .addCase(registrarAsistencia.fulfilled, (state, action) => {
        state.loading = false;
        state.asistencias.push(action.payload);
        state.error = null;
      })
      .addCase(registrarAsistencia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Asistencias
      .addCase(fetchAsistenciasPractica.fulfilled, (state, action) => {
        state.asistencias = action.payload;
      })

      // Evaluar Informe
      .addCase(evaluarInforme.fulfilled, (state, action) => {
        const index = state.informes.findIndex(
          (informe) => informe.id === action.payload.id
        );
        if (index !== -1) {
          state.informes[index] = action.payload;
        }
      })

      // Fetch Informes
      .addCase(fetchInformesPractica.fulfilled, (state, action) => {
        state.informes = action.payload;
      });
  },
});

export const { clearError, setSelectedPractica } = docenteSlice.actions;
export default docenteSlice.reducer;
