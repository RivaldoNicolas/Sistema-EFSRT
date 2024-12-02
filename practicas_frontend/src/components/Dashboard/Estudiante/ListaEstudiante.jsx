import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner, Button } from 'react-bootstrap';

const ListaEstudiante = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('ESTUDIANTE');

    const roles = [

        { label: 'Seleccione un rol' },
        { value: 'ESTUDIANTE', label: 'Estudiante' },
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
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Nombre de usuario</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user => (
                            <tr key={user.id}>
                                <td>{user.apellidos || user.last_name}</td>
                                <td>{user.nombres || user.first_name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};
export default ListaEstudiante;