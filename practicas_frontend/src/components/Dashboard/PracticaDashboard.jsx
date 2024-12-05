import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import styled from 'styled-components';
import { FaUserCircle, FaSignOutAlt, FaInfo, FaUsers, FaUserPlus, FaUserGraduate, FaBars, FaKey, FaBookReader, FaGavel, FaLayerGroup, FaPlus } from 'react-icons/fa';
import { showAlert } from '../../redux/slices/alertSlice';
import ChangePassword from './Users/ChangePassword';
import DocenteJuradoList from '../jurados/DocenteJuradoList';
import UserProfile from './Users/UserProfile';
import ModuleManagement from '../Modulos/ModuleManagement';
import CrearDocenteJurado from '../jurados/CrearDocenteJurado';
import JuradoManagement from '../jurados/JuradoManagement';
import AsignarDocente from '../Modulos/AsignarDocente';
import PracticaManagement from '../Practicas/PracticaManagement';
import EvaluacionForm from '../Evaluaciones/EvaluacionForm';


const DashboardContainer = styled(Container)`
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const SidebarWrapper = styled(Col)`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  
  @media (min-width: 768px) {
    transform: translateX(0);
    position: sticky;
    top: 0;
    height: 100vh;
    flex: 0 0 20%; // This will make it take 20% of the width
    max-width: 20%; // Ensures maximum width constraint
  }

  @media (max-width: 767px) {
    position: fixed;
    height: 100vh;
    z-index: 1030;
    transition: transform 0.3s ease;
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    width: 280px;
  }
`;

const NavItem = styled(motion.div)`
  margin: 8px 0;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #334155;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
    color: white;
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
`;

const MainContent = styled(Col)`
  padding: 20px;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    flex: 0 0 80%; // This will make it take 80% of the width
    max-width: 80%; // Ensures maximum width constraint
  }

  @media (max-width: 767px) {
    margin-left: 0;
    width: 100%;
  }
`;
const Header = styled(Navbar)`
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border-bottom: 3px solid #3b82f6;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const UserMenu = styled(Dropdown)`
  .dropdown-toggle::after {
    display: none;
  }

  .dropdown-menu {
    background: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  color: #334155;
  padding: 8px 16px;
  border-radius: 50px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    border-color: #3b82f6;
  }

  @media (max-width: 768px) {
    padding: 8px;
    .user-details {
      display: none;
    }
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 991px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1020;
  }
`;

const roleLabels = {
    'ADMIN': 'Administrador General',
    'FUA': 'Encargado FUA',
    'PRACTICAS': 'Encargado EFSRT',
    'COORDINADOR': 'Coordinador Academico',
    'SECRETARIA': 'Secretaria',
    'DOCENTE': 'Docente',
    'ESTUDIANTE': 'Estudiante',
    'JURADO': 'Jurado Evaluador'
};


const PracticaDashboard = () => {
    const [selectedModule, setSelectedModule] = useState(null);

    const [currentComponent, setCurrentComponent] = useState('welcome');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogout = () => {
        dispatch(logout());
        dispatch(showAlert({
            type: 'success',
            message: '¡Sesión cerrada exitosamente!'
        }));
        navigate('/login');
    };

    const menuItems = [
        {
            icon: <FaLayerGroup />,
            text: "MÓDULOS",
            component: 'modules'
        },
        {
            icon: <FaUserPlus />,
            text: "CREAR USUARIO",
            component: 'createUser'
        },
        {
            icon: <FaUsers />,
            text: "LISTA DE USUARIOS",
            component: 'usersList'
        },
        {
            icon: <FaBookReader />,
            text: "ASIGNAR DOCENTE",
            component: 'assignTeacher'
        },
        {
            icon: <FaGavel />,
            text: "JURADO MANAGEMENT",
            component: 'assignJury'
        },
        {
            icon: <FaPlus />,
            text: "PRACTICA MANAGEMENT",
            component: 'createPracticas'
        },
        {
            icon: <FaPlus />,
            text: "EVALUACION",
            component: 'evaluacionInforme'
        }
    ];

    const renderComponent = () => {
        switch (currentComponent) {
            case 'modules':
                return <ModuleManagement />;
            case 'createUser':
                return <CrearDocenteJurado />;
            case 'usersList':
                return <DocenteJuradoList />;
            case 'evaluacionInforme':
                return <EvaluacionForm />;
            case 'assignTeacher':
                return <AsignarDocente />;
            case 'createPracticas':
                return <PracticaManagement />;
            case 'assignJury':
                return <JuradoManagement />;
            case 'profile':
                return <UserProfile />;
            case 'changePassword':
                return <ChangePassword />;
            default:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-3 shadow-sm"
                    >
                        <div className="text-center mb-4">
                            <h2 className="text-primary fw-bold">¡Bienvenido al Dashboard! {roleLabels[user?.rol] || user?.rol}</h2>
                            <p className="text-muted">Usuario: {user?.username} | Rol: {roleLabels[user?.rol] || user?.rol}</p>
                        </div>

                        <div className="row g-4 mt-2">
                            <div className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <FaLayerGroup className="text-primary mb-3" size={40} />
                                        <h5 className="card-title">Gestión de Módulos</h5>
                                        <p className="card-text">Administra los módulos del sistema y sus configuraciones.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <FaBookReader className="text-success mb-3" size={40} />
                                        <h5 className="card-title">Asignación de Docentes</h5>
                                        <p className="card-text">Gestiona la asignación de docentes a los diferentes módulos.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center">
                                        <FaGavel className="text-info mb-3" size={40} />
                                        <h5 className="card-title">Asignación de Jurados</h5>
                                        <p className="card-text">Administra la asignación de jurados evaluadores.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-light rounded-3">
                            <h4 className="text-secondary mb-3">Accesos Rápidos</h4>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => setCurrentComponent('modules')}
                                    >
                                        <FaLayerGroup className="me-2" /> Gestionar Módulos
                                    </button>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-outline-success w-100"
                                        onClick={() => setCurrentComponent('assignTeacher')}
                                    >
                                        <FaBookReader className="me-2" /> Asignar Docentes
                                    </button>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-outline-info w-100"
                                        onClick={() => setCurrentComponent('assignJury')}
                                    >
                                        <FaGavel className="me-2" /> Asignar Jurados
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-muted">
                            <p>Para comenzar, selecciona una opción del menú lateral o usa los accesos rápidos.</p>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <DashboardContainer fluid>
            <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

            <Row>
                <SidebarWrapper $isOpen={sidebarOpen}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtjWt8u8zfB-EVkIItTLQj4sAPiLsg3vmADg&s"
                                alt="Logo"
                                className="img-fluid rounded-circle"
                                style={{ width: '100px' }}
                            />
                        </motion.div>
                        <button
                            className="btn-close d-lg-none"
                            onClick={() => setSidebarOpen(false)}
                        />
                    </div>

                    <Nav className="flex-column">
                        {menuItems.map((item, index) => (
                            <NavItem
                                key={index}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }} x
                                onClick={() => {
                                    setCurrentComponent(item.component);
                                    setSidebarOpen(false);
                                }}
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </NavItem>
                        ))}
                    </Nav>
                </SidebarWrapper>

                <MainContent>
                    <Header>
                        <button
                            className="btn btn-light d-lg-none"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FaBars />
                        </button>

                        <Navbar.Brand className="text-info fw-bold fs-3 ms-3">
                            {roleLabels[user?.rol] || user?.rol}
                        </Navbar.Brand>

                        <UserMenu align="end">
                            <UserMenu.Toggle as="div">
                                <UserInfo as={motion.div} whileHover={{ scale: 1.02 }}>
                                    <div className="user-details">
                                        <span className="fw-bold">{user?.username}</span>
                                    </div>
                                    <FaUserCircle size={35} />
                                </UserInfo>
                            </UserMenu.Toggle>

                            <UserMenu.Menu>
                                <UserMenu.Item onClick={() => setCurrentComponent('profile')}>
                                    <FaInfo className="me-2" /> Mi Perfil
                                </UserMenu.Item>
                                <UserMenu.Item onClick={() => setCurrentComponent('changePassword')}>
                                    <FaKey className="me-2" /> Cambiar Contraseña
                                </UserMenu.Item>
                                <UserMenu.Divider />
                                <UserMenu.Item className="text-danger" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-2" /> Cerrar Sesión
                                </UserMenu.Item>
                            </UserMenu.Menu>
                        </UserMenu>
                    </Header>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                    >
                        {window.location.pathname.includes('/modulos/') ? (
                            <Outlet />
                        ) : (
                            renderComponent()
                        )}
                    </motion.div>
                </MainContent>
            </Row>
        </DashboardContainer>
    );
}

export default PracticaDashboard;
