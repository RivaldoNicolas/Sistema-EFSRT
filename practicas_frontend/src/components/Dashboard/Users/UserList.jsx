import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner } from 'react-bootstrap';

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('PRACTICAS');

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
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{roles.find(role => role.value === user.rol)?.label}</td>
                                <td>{user.is_active ? 'Activo' : 'Inactivo'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default UserList;