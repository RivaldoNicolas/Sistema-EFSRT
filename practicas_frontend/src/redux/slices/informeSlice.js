import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Thunks
export const fetchInformes = createAsyncThunk(
  "informes/fetchInformes",
  async (_, { getState }) => {
    const userId = getState().auth.user?.id;
    const response = await api.get(`/informes/?estudiante=${userId}`);
    return response.data;
  }
);

export const createInforme = createAsyncThunk(
  "informes/createInforme",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/informes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error en createInforme:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error al crear el informe"
      );
    }
  }
);

export const fetchInformeById = createAsyncThunk(
  "informes/fetchInformeById",
  async (id) => {
    const response = await api.get(`/informes/${id}/`);
    return response.data;
  }
);

export const updateInforme = createAsyncThunk(
  "informes/updateInforme",
  async ({ id, informeData }) => {
    const formData = new FormData();
    Object.keys(informeData).forEach((key) => {
      if (informeData[key] !== undefined) {
        formData.append(key, informeData[key]);
      }
    });

    const response = await api.patch(`/informes/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);
export const evaluarInforme = createAsyncThunk(
  "informes/evaluarInforme",
  async ({ informeId, evaluacionData }) => {
    const response = await api.post(
      `/informes/${informeId}/evaluar/`,
      evaluacionData
    );
    return response.data;
  }
);

const informeSlice = createSlice({
  name: "informes",
  initialState: {
    informes: [],
    selectedInforme: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedInforme: (state, action) => {
      state.selectedInforme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch informes
      .addCase(fetchInformes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInformes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.informes = action.payload;
      })
      .addCase(fetchInformes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Create informe
      .addCase(createInforme.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createInforme.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.informes.push(action.payload);
      })
      .addCase(createInforme.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch single informe
      .addCase(fetchInformeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInformeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedInforme = action.payload;
      })
      .addCase(fetchInformeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Update informe
      .addCase(updateInforme.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateInforme.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.informes.findIndex(
          (informe) => informe.id === action.payload.id
        );
        if (index !== -1) {
          state.informes[index] = action.payload;
        }
      })
      .addCase(updateInforme.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearError, setSelectedInforme } = informeSlice.actions;
export default informeSlice.reducer;
