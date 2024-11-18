import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import styled from 'styled-components';
import { FaUserCircle, FaSignOutAlt, FaInfo, FaClipboardList, FaCalendarCheck, FaChalkboardTeacher, FaFileAlt } from 'react-icons/fa';
import { showAlert } from '../../redux/slices/alertSlice';

const DashboardContainer = styled(Container)`
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const SidebarWrapper = styled(Col)`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
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
`;

const Header = styled(Navbar)`
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border-bottom: 3px solid #3b82f6;
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
`;

const PracticaDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        { icon: <FaClipboardList />, text: "ASISTENCIA" },
        { icon: <FaCalendarCheck />, text: "EVALUACIÓN DIARIA" },
        { icon: <FaChalkboardTeacher />, text: "EVALUACIÓN DE EXPOSICIÓN" },
        { icon: <FaFileAlt />, text: "EVALUACIÓN DE INFORME" }
    ];

    return (
        <DashboardContainer fluid>
            <Row>
                <SidebarWrapper md={3} lg={2} isOpen={sidebarOpen} className="vh-100 py-4">
                    <motion.div
                        className="text-center mb-5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtjWt8u8zfB-EVkIItTLQj4sAPiLsg3vmADg&s"
                            alt="Logo"
                            className="img-fluid"
                            style={{ borderRadius: '50%', width: '100px' }}
                        />
                    </motion.div>

                    <Nav className="flex-column px-3">
                        {menuItems.map((item, index) => (
                            <NavItem
                                key={index}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.icon}
                                <span>{item.text}</span>
                            </NavItem>
                        ))}
                    </Nav>
                </SidebarWrapper>

                <MainContent md={9} lg={10}>
                    <Header className="px-4 py-3">
                        <button
                            className="d-md-none btn btn-light"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </button>

                        <Navbar.Brand className="text-info fw-bold fs-3">
                            Panel de Control
                        </Navbar.Brand>

                        <UserMenu align="end" className="ms-auto">
                            <UserMenu.Toggle as="div">
                                <UserInfo as={motion.div} whileHover={{ scale: 1.02 }}>
                                    <span className="d-none d-md-block">AMACHE CHOQUE CERAPIO</span>
                                    <FaUserCircle size={35} />
                                </UserInfo>
                            </UserMenu.Toggle>

                            <UserMenu.Menu>
                                <UserMenu.Item>
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
                        className="bg-white p-4 rounded-3 shadow-sm"
                    >
                        <h2>Bienvenido al Sistema</h2>
                        {/* Aquí puedes agregar el contenido principal del dashboard */}

                    </motion.div>
                </MainContent>
            </Row>
        </DashboardContainer>
    );
}

export default PracticaDashboard;
