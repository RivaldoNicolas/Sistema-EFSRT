import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner } from 'react-bootstrap';

const NotaList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('PRACTICAS');

    const roles = [
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
                <h3>Lista de Estudiantes</h3>
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
                            <th>Nota Conceptual</th>
                            <th>Nota Procedimental</th>
                            <th>Nota Aptitudinal</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                </Table>
            )}
        </div>
    );
};

export default NotaList;