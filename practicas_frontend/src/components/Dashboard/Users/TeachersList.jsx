import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Spinner, Button, Modal } from 'react-bootstrap';
import { fetchUsersByRole, fetchUserDetails } from '../../../redux/slices/userSlice';

const TeachersList = () => {
    const dispatch = useDispatch();
    const { users, loading, selectedUser } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('DOCENTE');
    const [showModal, setShowModal] = useState(false);

    const roles = [
        { value: 'DOCENTE', label: 'Docente' },
        { value: 'JURADO', label: 'Jurado Evaluador' }
    ];

    const handleViewDetails = async (userId) => {
        try {
            await dispatch(fetchUserDetails(userId)).unwrap();
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        dispatch(fetchUsersByRole(selectedRole));
    }, [dispatch, selectedRole]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Lista de Docentes</h3>
                <Form.Select
                    style={{ width: '300px' }}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    {roles.map(role => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </Form.Select>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>N° Celular</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user => (
                            <tr key={user.id}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{roles.find(role => role.value === user.rol)?.label}</td>
                                <td>{user.telefono || 'No especificado'}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleViewDetails(user.id)}
                                    >
                                        Ver Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Docente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p><strong>Nombres:</strong> {selectedUser.first_name}</p>
                            <p><strong>Apellidos:</strong> {selectedUser.last_name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Teléfono:</strong> {selectedUser.telefono || 'No especificado'}</p>
                            <p><strong>Dirección:</strong> {selectedUser.direccion || 'No especificada'}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TeachersList;
