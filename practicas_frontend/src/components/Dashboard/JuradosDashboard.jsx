import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import styled from 'styled-components';
import { FaUserCircle, FaSignOutAlt, FaInfo, FaUsers, FaChalkboardTeacher, FaBars } from 'react-icons/fa';
import { showAlert } from '../../redux/slices/alertSlice';
import UserList from '../Dashboard/Users/UserList';
import UserProfile from '../Dashboard/Users/UserProfile';
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
    flex: 0 0 20%;
    max-width: 20%;
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
    flex: 0 0 80%;
    max-width: 80%;
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

const JuradosDashboard = () => {
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

    const handleUserSelect = (userId) => {
        setCurrentComponent('EvaluacionForm');
        navigate(`/jurado/evaluacion/${userId}`);
    };

    const menuItems = [
        { icon: <FaUsers />, text: "LISTA DE USUARIOS", component: 'usersList' },
        { icon: <FaChalkboardTeacher />, text: "EVALUACIÓN DE EXPOSICIÓN", component: 'EvaluacionForm' }
    ];

    const renderComponent = () => {
        switch (currentComponent) {
            case 'usersList':
                return <UserList onUserSelect={handleUserSelect} />;
            case 'EvaluacionForm':
                return <EvaluacionForm />;
            case 'profile':
                return <UserProfile />;
            default:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-3 shadow-sm"
                    >
                        <h2>Bienvenido al Sistema</h2>
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
                                whileTap={{ scale: 0.95 }}
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
                            {user?.rol}
                        </Navbar.Brand>

                        <UserMenu align="end">
                            <UserMenu.Toggle as="div">
                                <UserInfo as={motion.div} whileHover={{ scale: 1.02 }}>
                                    <div className="user-details">
                                        <span className="fw-bold">usuario: {user?.username}</span>
                                    </div>
                                    <FaUserCircle size={35} />
                                </UserInfo>
                            </UserMenu.Toggle>

                            <UserMenu.Menu>
                                <UserMenu.Item onClick={() => setCurrentComponent('profile')}>
                                    <FaInfo className="me-2" /> Mi Perfil
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
                        {renderComponent()}
                    </motion.div>
                </MainContent>
            </Row>
        </DashboardContainer>
    );
}

export default JuradosDashboard;