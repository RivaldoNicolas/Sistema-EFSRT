import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Spinner, Button, Modal } from 'react-bootstrap';
import { showAlert } from '../../../redux/slices/alertSlice';
import {
    fetchUsersByRole,
    fetchUserDetails,
    deleteUser,
} from "../../../redux/slices/userSlice";


const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('PRACTICAS');
    const [showModal, setShowModal] = useState(false);
    const { selectedUser } = useSelector(state => state.users);

    const roles = [
        { value: 'ADMIN', label: 'Administrador General' },
        { value: 'FUA', label: 'Encargado FUA' },
        { value: 'PRACTICAS', label: 'Encargado EFSRT' },
        { value: 'COORDINADOR', label: 'Coordinador Academico' },
        { value: 'SECRETARIA', label: 'Secretaria' },
        { value: 'DOCENTE', label: 'Docente' },
        { value: 'ESTUDIANTE', label: 'Estudiante' },
        { value: 'JURADO', label: 'Jurado Evaluador' }
    ];

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
            console.log('Starting user details fetch...');
            console.log('Token:', localStorage.getItem('token'));
            console.log('UserID:', userId);

            await dispatch(fetchUserDetails(userId)).unwrap();
            console.log('User details fetched successfully');
            setShowModal(true);
        } catch (error) {
            console.log('Error fetching user details:', error);
            dispatch(showAlert({
                type: 'error',
                message: 'Error al obtener detalles del usuario'
            }));
        }
    };


    useEffect(() => {
        dispatch(fetchUsersByRole(selectedRole));
    }, [dispatch, selectedRole]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Lista de Usuarios</h3>
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

export default UserList;
