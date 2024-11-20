import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import backgroundImage from '../../assets/fondo.png';
import Header from '../Layout/Header';
import { FaUser, FaLock } from 'react-icons/fa';
import { showAlert } from '../../redux/slices/alertSlice';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [alert, setAlert] = useState({ type: '', message: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login(credentials);

            const userData = {
                token: data.access,
                user: {
                    ...data.user,
                    rol: data.user.rol || 'default'
                }
            };

            // Dispatch del login con los datos completos
            dispatch(loginSuccess(userData));

            dispatch(showAlert({
                type: 'success',
                message: `¡Bienvenido ${data.user.username}!`
            }));

            // Navegación según rol
            const routeMap = {
                'ADMIN': '/admin/dashboard',
                'FUA': '/fua/dashboard',
                'PRACTICAS': '/practicas/dashboard',
                'COORDINADOR': '/coordinador/dashboard',
                'SECRETARIA': '/secretaria/dashboard',
                'DOCENTE': '/docente/dashboard',
                'ESTUDIANTE': '/estudiante/dashboard',
                'JURADO': '/jurados/dashboard'
            };

            navigate(routeMap[data.user.rol] || '/dashboard');

        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.message || 'Error al iniciar sesión'
            }));
        }
    };


    const containerStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
    };

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(0px)',
    };

    return (
        <>
            <Header />
            <div className="container-fluid d-flex align-items-center justify-content-center" style={containerStyle}>

                <div className="card shadow-lg" style={{ ...cardStyle, maxWidth: '400px' }}>
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary">EFSRT SISTEMA</h2>
                            <p className="text-muted">Ingrese sus credenciales</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control py-2"
                                        placeholder="Usuario"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({
                                            ...credentials,
                                            username: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                        <FaLock />
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control py-2"
                                        placeholder="Contraseña"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({
                                            ...credentials,
                                            password: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 mb-3 text-uppercase fw-bold"
                            >
                                Iniciar Sesión
                            </button>

                            <div className="d-flex justify-content-between align-items-center">
                                <button type="button" className="btn btn-link text-decoration-none">
                                    ¿Olvidó su contraseña?
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Login;
