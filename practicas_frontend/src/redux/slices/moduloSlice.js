import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchModulos = createAsyncThunk(
  "modulos/fetchModulos",
  async () => {
    const response = await api.get("/modulos/");
    return response.data;
  }
);

export const fetchJurados = createAsyncThunk(
  "modulos/fetchJurados",
  async () => {
    const response = await api.get("/usuarios/?rol=JURADO");
    return response.data;
  }
);

export const fetchJuradosAsignados = createAsyncThunk(
  "modulos/listarJuradosAsignados",
  async (moduloId, { getState }) => {
    const token = getState().auth.token;
    const response = await api.get(`/modulos/${moduloId}/listar-jurados/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }
);

// la acción asignarJurado
export const asignarJurado = createAsyncThunk(
  "modulos/asignarJurado",
  async ({ modulo_id, jurado_id, estudiante_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/modulos/${modulo_id}/asignar-jurado/`, {
        jurado_id,
        estudiante_id,
      });

      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error en la asignación"
      );
    }
  }
);

export const fetchModuloDetails = createAsyncThunk(
  "modulos/fetchDetails",
  async (id, { getState }) => {
    if (!id) throw new Error("ID no válido");
    const token = getState().auth.token;
    const response = await api.get(`/modulos/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const createModulo = createAsyncThunk(
  "modulos/createModulo",
  async (moduloData) => {
    const formDataToSend = new FormData();

    // Agregar cada campo al FormData
    formDataToSend.append("nombre", moduloData.nombre);
    formDataToSend.append("descripcion", moduloData.descripcion);
    formDataToSend.append("tipo_modulo", moduloData.tipo_modulo);
    formDataToSend.append("horas_requeridas", moduloData.horas_requeridas);
    formDataToSend.append("fecha_inicio", moduloData.fecha_inicio);
    formDataToSend.append("fecha_fin", moduloData.fecha_fin);
    formDataToSend.append("activo", moduloData.activo.toString());

    // Manejar el archivo si existe
    if (moduloData.estructura_informe instanceof File) {
      formDataToSend.append(
        "estructura_informe",
        moduloData.estructura_informe
      );
    }

    const response = await api.post("/modulos/", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const updateModulo = createAsyncThunk(
  "modulos/update",
  async ({ id, moduloData }) => {
    // Usamos PATCH en lugar de PUT para actualizaciones parciales
    const response = await api.patch(`/modulos/${id}/`, moduloData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data;
  }
);

export const deleteModulo = createAsyncThunk(
  "modulos/deleteModulo",
  async (moduloId) => {
    await api.delete(`/modulos/${moduloId}/`);
    return moduloId;
  }
);

export const fetchJuradosDisponibles = createAsyncThunk(
  "modulos/fetchJuradosDisponibles",
  async (_, { getState }) => {
    const token = getState().auth.token;
    console.log("Fetching jurados...");
    const response = await api.get("/usuarios/?rol=JURADO", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Jurados response:", response.data);
    return response.data;
  }
);

export const listarJuradosAsignados = createAsyncThunk(
  "modulos/listarJuradosAsignados",
  async (moduloId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/modulos/${moduloId}/listar-jurados/`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error al obtener los datos"
      );
    }
  }
);

export const asignarDocente = createAsyncThunk(
  "modulos/asignarDocente",
  async ({ moduloId, docenteId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/modulos/${moduloId}/asignar-docente/`, {
        docente_id: docenteId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const verificarPracticaExistente = createAsyncThunk(
  "modulos/verificarPracticaExistente",
  async ({ modulo_id, estudiante_id }) => {
    const response = await api.get(
      `/practicas/verificar/${modulo_id}/${estudiante_id}/`
    );
    return response.data;
  }
);

export const fetchJuradosPractica = createAsyncThunk(
  "modulos/fetchJuradosPractica",
  async ({ modulo_id, estudiante_id }) => {
    const response = await api.get(
      `/practicas/jurados/${modulo_id}/${estudiante_id}/`
    );
    return response.data;
  }
);

const moduloSlice = createSlice({
  name: "modulos",
  initialState: {
    modulos: [],
    selectedModulo: null,
    currentModulo: null,
    juradosAsignados: [], // Inicializar como un arreglo vacío
    juradoAsignado: null,
    jurados: [],
    juradosPractica: [], // Add this
    practicaExiste: false, // Add this
    loading: false,
    error: null,
  },
  reducers: {
    clearModuloError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verificarPracticaExistente.fulfilled, (state, action) => {
        state.practicaExiste = action.payload.exists;
      })
      .addCase(fetchJuradosPractica.fulfilled, (state, action) => {
        state.juradosPractica = action.payload;
      })
      .addCase(listarJuradosAsignados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listarJuradosAsignados.fulfilled, (state, action) => {
        state.loading = false;
        state.juradosAsignados = action.payload;
        state.error = null;
      })
      .addCase(listarJuradosAsignados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(asignarJurado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asignarJurado.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update juradosAsignados if needed
        if (action.payload.data) {
          const moduloId = action.payload.data.practica_id;
          const juradoId = action.payload.data.asignacion_id;

          // Update the jurados list for the specific módulo
          const moduleIndex = state.modulos.findIndex(
            (modulo) => modulo.id === moduloId
          );
          if (moduleIndex !== -1) {
            if (!state.modulos[moduleIndex].jurados) {
              state.modulos[moduleIndex].jurados = [];
            }
            state.modulos[moduleIndex].jurados.push(juradoId);
          }
        }
      })
      .addCase(asignarJurado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al asignar jurado";
      })
      .addCase(fetchJuradosDisponibles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJuradosDisponibles.fulfilled, (state, action) => {
        state.loading = false;
        state.juradosDisponibles = action.payload;
        state.error = null;
      })
      .addCase(fetchJuradosDisponibles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.juradosDisponibles = [];
      })

      .addCase(fetchModulos.fulfilled, (state, action) => {
        state.modulos = action.payload;
      })
      .addCase(fetchJurados.fulfilled, (state, action) => {
        state.jurados = action.payload;
      })
      .addCase(fetchModulos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createModulo.fulfilled, (state, action) => {
        state.modulos.push(action.payload);
      })
      .addCase(updateModulo.fulfilled, (state, action) => {
        const index = state.modulos.findIndex(
          (modulo) => modulo.id === action.payload.id
        );
        if (index !== -1) {
          state.modulos[index] = action.payload;
        }
        state.selectedModulo = action.payload;
      })
      .addCase(deleteModulo.fulfilled, (state, action) => {
        state.modulos = state.modulos.filter(
          (modulo) => modulo.id !== action.payload
        );
      })
      .addCase(fetchModuloDetails.fulfilled, (state, action) => {
        state.selectedModulo = action.payload;
      });
  },
});
export const { clearModuloError } = moduloSlice.actions;
export default moduloSlice.reducer;
