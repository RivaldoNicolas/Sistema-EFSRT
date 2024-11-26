import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchModulos = createAsyncThunk(
  "modulos/fetchModulos",
  async () => {
    const response = await api.get("/modulos/");
    return response.data;
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

export const asignarJurado = createAsyncThunk(
  "modulos/asignarJurado",
  async ({ moduloId, juradoId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/modulos/${moduloId}/asignar-jurado/`, {
        jurado: juradoId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al asignar jurado"
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
const moduloSlice = createSlice({
  name: "modulos",
  initialState: {
    modulos: [],
    selectedModulo: null,
    loading: false,
    error: null,
    currentModulo: null,
    juradoAsignado: null,
  },
  reducers: {
    clearModuloError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asignarJurado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asignarJurado.fulfilled, (state, action) => {
        state.loading = false;
        state.juradoAsignado = action.payload.data.jurado;
      })
      .addCase(asignarJurado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchModulos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulos.fulfilled, (state, action) => {
        state.loading = false;
        state.modulos = action.payload;
        state.error = null;
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
