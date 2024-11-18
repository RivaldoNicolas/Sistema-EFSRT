import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    alerts: [],
  },
  reducers: {
    showAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
  },
});

export const { showAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
