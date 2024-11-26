// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import alertReducer from "./slices/alertSlice";
import userReducer from "./slices/userSlice";
import moduloReducer from "./slices/moduloSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    users: userReducer,
    modulos: moduloReducer,
  },
});
