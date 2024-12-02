import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Spinner, Button, Modal } from 'react-bootstrap';
import { showAlert } from '../../redux/slices/alertSlice';
import {
    fetchUsersByRole,
    fetchUserDetails,
    deleteUser,
} from "../../redux/slices/userSlice";

const DocenteJuradoList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [showModal, setShowModal] = useState(false);
    const { selectedUser } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('JURADO');

    const roles = [
        { value: 'JURADO', label: 'Jurado Evaluador' },
        { value: 'DOCENTE', label: 'Docente' }
    ];

    useEffect(() => {
        // Fetch users based on the selected role
        dispatch(fetchUsersByRole(selectedRole));
    }, [dispatch, selectedRole]);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
                dispatch(showAlert({
                    type: 'success',
                    message: 'Usuario eliminado exitosamente'
                }));
            } catch (error) {
                dispatch(showAlert({
                    type: 'error',
                    message: 'Error al eliminar usuario'
                }));
            }
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            await dispatch(fetchUserDetails(userId)).unwrap();
            setShowModal(true);
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: 'Error al obtener detalles del usuario'
            }));
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3>Lista de Jurados y Docentes</h3>
            <Form.Group controlId="roleSelect" className="mb-3">
                <Form.Label>Filtrar por Rol</Form.Label>
                <Form.Control as="select" value={selectedRole} onChange={handleRoleChange}>
                    {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{roles.find(role => role.value === user.rol)?.label}</td>
                                <td>{user.is_active ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleViewDetails(user.id)}
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="user-details">
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Nombre:</strong> {selectedUser.first_name}</p>
                            <p><strong>Apellido:</strong> {selectedUser.last_name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Rol:</strong> {roles.find(role => role.value === selectedUser.rol)?.label}</p>
                            <p><strong>Estado:</strong> {selectedUser.is_active ? 'Activo' : 'Inactivo'}</p>
                            <p><strong>Teléfono:</strong> {selectedUser.telefono || 'No especificado'}</p>
                            <p><strong>Dirección:</strong> {selectedUser.direccion || 'No especificada'}</p>
                            <p><strong>Edad:</strong> {selectedUser.edad || 'No especificada'}</p>
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

export default DocenteJuradoList;