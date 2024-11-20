import React, { useState } from 'react';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaIdCard, FaUserTag, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import EditProfile from './EditProfile';  // Add this import

const ProfileCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const DataRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const DataLabel = styled.td`
  font-weight: 600;
  color: #4a5568;
`;
const EditButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
`;


const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const user = useSelector(state => state.auth.user);

    if (isEditing) {
        return <EditProfile onCancel={() => setIsEditing(false)} />;
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Row className="justify-content-center">
                <Col md={10}>
                    <ProfileCard>
                        <Card.Header className="bg-primary text-white py-3 position-relative">
                            <h4 className="mb-0">Mi Perfil</h4>
                            <EditButton
                                variant="light"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                Editar Perfil
                            </EditButton>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="text-center mb-4">
                                    <div className="rounded-circle bg-light p-3 d-inline-block mb-3">
                                        <FaUser size={60} className="text-primary" />
                                    </div>
                                    <h5>{user?.username}</h5>
                                    <p className="text-muted">{user?.rol}</p>
                                </Col>
                                <Col md={8}>
                                    <Table hover responsive>
                                        <tbody>
                                            <DataRow>
                                                <DataLabel><FaIdCard className="me-2 text-primary" /> ID:</DataLabel>
                                                <td>{user?.id}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaUser className="me-2 text-primary" /> Username:</DataLabel>
                                                <td>{user?.username}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaEnvelope className="me-2 text-primary" /> Email:</DataLabel>
                                                <td>{user?.email}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaUserTag className="me-2 text-primary" /> Rol:</DataLabel>
                                                <td>{user?.rol}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaUser className="me-2 text-primary" /> Nombre:</DataLabel>
                                                <td>{user?.first_name || 'No especificado'}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaUser className="me-2 text-primary" /> Apellido:</DataLabel>
                                                <td>{user?.last_name || 'No especificado'}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaPhone className="me-2 text-primary" /> Teléfono:</DataLabel>
                                                <td>{user?.telefono || 'No especificado'}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaMapMarkerAlt className="me-2 text-primary" /> Dirección:</DataLabel>
                                                <td>{user?.direccion || 'No especificada'}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel><FaBirthdayCake className="me-2 text-primary" /> Edad:</DataLabel>
                                                <td>{user?.edad || 'No especificada'}</td>
                                            </DataRow>
                                            <DataRow>
                                                <DataLabel>Estado de Autenticación:</DataLabel>
                                                <td>{user?.isAuthenticated ? 'Autenticado' : 'No Autenticado'}</td>
                                            </DataRow>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </ProfileCard>
                </Col>
            </Row>
        </motion.div>
    );
};

export default UserProfile;
