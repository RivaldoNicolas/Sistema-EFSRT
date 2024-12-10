import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// New async action to fetch practicas with filters
export const fetchPracticasWithFilters = createAsyncThunk(
  "practicas/fetchWithFilters",
  async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/practicas/?${queryParams}`);
    return response.data;
  }
);

// Define the async thunk for fetching module types
export const fetchModuleTypes = createAsyncThunk(
  "practicas/fetchModuleTypes",
  async () => {
    const response = await fetch("/api/module-types"); // Adjust the API endpoint as needed
    if (!response.ok) {
      throw new Error("Failed to fetch module types");
    }
    return response.json();
  }
);

// Async Actions
export const createPractica = createAsyncThunk(
  "practicas/create",
  async (practicaData, { rejectWithValue }) => {
    try {
      const formattedData = {
        estudiante_id: Number(practicaData.estudiante),
        modulo_id: Number(practicaData.modulo),
        supervisor_id: Number(practicaData.supervisor),
        fecha_inicio: practicaData.fecha_inicio,
        fecha_fin: new Date(
          new Date(practicaData.fecha_inicio).getTime() +
            180 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        estado: "PENDIENTE",
      };

      const response = await api.post("/practicas/", formattedData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        Object.values(error.response?.data || {})[0]?.[0] ||
        "Error al crear la práctica";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPracticas = createAsyncThunk(
  "practicas/fetchAll",
  async (_, { getState }) => {
    const userId = getState().auth.user?.id;
    const response = await api.get(`/practicas/?estudiante=${userId}`);
    return response.data;
  }
);

export const fetchPracticaById = createAsyncThunk(
  "practicas/fetchById",
  async (id) => {
    const response = await api.get(`/practicas/${id}/`);
    return response.data;
  }
);

export const updatePractica = createAsyncThunk(
  "practicas/update",
  async ({ id, data }) => {
    const response = await api.put(`/practicas/${id}/`, data);
    return response.data;
  }
);

export const deletePractica = createAsyncThunk(
  "practicas/delete",
  async (id) => {
    await api.delete(`/practicas/${id}/`);
    return id;
  }
);

const practicasSlice = createSlice({
  name: "practicas",
  initialState: {
    items: [],
    moduleTypes: [],
    selectedPractica: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedPractica: (state) => {
      state.selectedPractica = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Corrected here
    builder
      .addCase(fetchModuleTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModuleTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleTypes = action.payload;
      })
      .addCase(fetchModuleTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Practicas with Filters
      .addCase(fetchPracticasWithFilters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPracticasWithFilters.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPracticasWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Practica
      .addCase(createPractica.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPractica.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createPractica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch All Practicas
      .addCase(fetchPracticas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPracticas.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPracticas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Single Practica
      .addCase(fetchPracticaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPracticaById.fulfilled, (state, action) => {
        state.selectedPractica = action.payload;
        state.loading = false;
      })
      .addCase(fetchPracticaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Practica
      .addCase(updatePractica.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePractica.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updatePractica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Practica
      .addCase(deletePractica.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePractica.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(deletePractica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedPractica, setLoading } = practicasSlice.actions;
export default practicasSlice.reducer;
