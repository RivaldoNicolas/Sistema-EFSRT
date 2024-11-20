import { Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import PrivateRoute from '../utils/PrivateRoute';
import Layout from '../components/Layout/Layout';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import PracticaDashboard from '../components/Dashboard/PracticaDashboard';
import EstudianteDashboard from '../components/Dashboard/EstudianteDashboard';
import FuaDashboard from '../components/Dashboard/FuaDashboard';
import DocenteDashboard from '../components/Dashboard/DocenteDashboard';
import JuradosDashboard from '../components/Dashboard/JuradosDashboard';
import SecretariaDashboard from '../components/Dashboard/SecretariaDashboard';
import CoordinadorDashboard from '../components/Dashboard/CoordinadorDashboard';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin/dashboard" element={
                <PrivateRoute>
                    <AdminDashboard />
                </PrivateRoute>
            } />
            <Route path="/practicas/dashboard" element={
                <PrivateRoute>
                    <PracticaDashboard />
                </PrivateRoute>
            } />
            <Route path="/estudiante/dashboard" element={
                <PrivateRoute>
                    <EstudianteDashboard />
                </PrivateRoute>
            } />
            <Route path="/fua/dashboard" element={
                <PrivateRoute>3
                    <FuaDashboard />
                </PrivateRoute>
            } />
            <Route path="/docente/dashboard" element={
                <PrivateRoute>
                    <DocenteDashboard />
                </PrivateRoute>
            } />
            <Route path="/jurados/dashboard" element={
                <PrivateRoute>
                    <JuradosDashboard />
                </PrivateRoute>
            } />
            <Route path="/secretaria/dashboard" element={
                <PrivateRoute>
                    <SecretariaDashboard />
                </PrivateRoute>
            } />
            <Route path="/coordinador/dashboard" element={
                <PrivateRoute>
                    <CoordinadorDashboard />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
