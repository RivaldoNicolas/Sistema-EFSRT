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

export const subirBoletaThunk = createAsyncThunk(
  "estudiantes/subirBoleta",
  async ({ estudianteId, file }) => {
    const formData = new FormData();
    formData.append("boleta_pago", file);

    const response = await axios.patch(
      `/api/estudiantes/${estudianteId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      estudianteId,
      data: response.data,
    };
  }
);

const estudiantesSlice = createSlice({
  name: "estudiantes",
  initialState: {
    estudiantes: [],
    status: "idle",
    error: null,
    boletasStatus: {},
    boletas: {},
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
      })
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
      })
      .addCase(subirBoletaThunk.pending, (state, action) => {
        const estudianteId = action.meta.arg.estudianteId;
        state.boletasStatus[estudianteId] = "loading";
      })
      .addCase(subirBoletaThunk.fulfilled, (state, action) => {
        const { estudianteId, data } = action.payload;
        state.boletasStatus[estudianteId] = "succeeded";
        state.boletas[estudianteId] = data.boleta_pago;

        const estudiante = state.estudiantes.find((e) => e.id === estudianteId);
        if (estudiante) {
          estudiante.boleta_pago = data.boleta_pago;
        }
      })
      .addCase(subirBoletaThunk.rejected, (state, action) => {
        const estudianteId = action.meta.arg.estudianteId;
        state.boletasStatus[estudianteId] = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectBoletaStatus = (state, estudianteId) =>
  state.estudiantes.boletasStatus[estudianteId];

export const selectBoletaUrl = (state, estudianteId) =>
  state.estudiantes.boletas[estudianteId];

export default estudiantesSlice.reducer;
