import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import estudiantesReducer from "./slices/estudiantesSlice";
import alertReducer from "./slices/alertSlice";
import userReducer from "./slices/userSlice";
import moduloReducer from "./slices/moduloSlice";
import practicasReducer from "./slices/practicasSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    users: userReducer,
    modulos: moduloReducer,
    practicas: practicasReducer,
    estudiantes: estudiantesReducer,
  },
});
