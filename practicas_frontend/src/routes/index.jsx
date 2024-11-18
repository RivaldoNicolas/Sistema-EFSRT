import { Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import PrivateRoute from '../utils/PrivateRoute';
import Layout from '../components/Layout/Layout';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import PracticaDashboard from '../components/Dashboard/PracticaDashboard';

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
        </Routes>
    );
};

export default AppRoutes;
