import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import estudiantesReducer from "./slices/estudiantesSlice";
import alertReducer from "./slices/alertSlice";
import userReducer from "./slices/userSlice";
import moduloReducer from "./slices/moduloSlice";
import practicasReducer from "./slices/practicasSlice";
import docenteReducer from "./slices/docenteSlice";
import juradoReducer from "./slices/juradosSlice";
import informeReducer from "./slices/informeSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    users: userReducer,
    modulos: moduloReducer,
    practicas: practicasReducer,
    estudiantes: estudiantesReducer,
    docente: docenteReducer,
    jurado: juradoReducer,
    informes: informeReducer,
  },
});
