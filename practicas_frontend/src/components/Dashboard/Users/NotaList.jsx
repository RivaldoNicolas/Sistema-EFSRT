import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner, Button, InputGroup } from 'react-bootstrap';

const NotaList = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('ESTUDIANTE');
    const [searchDni, setSearchDni] = useState('');

    const roles = [
        { value: 'ESTUDIANTE', label: 'Estudiante' },
        { value: 'FUA', label: 'Encargado FUA' },
        { value: 'PRACTICAS', label: 'Encargado EFSRT' },
        { value: 'COORDINADOR', label: 'Coordinador Academico' },
        { value: 'SECRETARIA', label: 'Secretaria' },
        { value: 'DOCENTE', label: 'Docente' },
        { value: 'JURADO', label: 'Jurado Evaluador' }
    ];

    // Fetch students on component mount
    useEffect(() => {
        dispatch(fetchUsersByRole('ESTUDIANTE'));
    }, [dispatch]);

    // Handle role changes
    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        dispatch(fetchUsersByRole(e.target.value));
    };

    const handleFilter = () => {
        dispatch(fetchUsersByRole(selectedRole, searchDni));
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
                <h3>Lista de Estudiantes</h3>
                <div className="d-flex gap-3">
                    <Form.Select
                        style={{ width: '300px' }}
                        value={selectedRole}
                        onChange={handleRoleChange}
                    >
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </Form.Select>

                    <InputGroup style={{ width: '300px' }}>
                        <Form.Control
                            placeholder="Buscar por DNI"
                            value={searchDni}
                            onChange={(e) => setSearchDni(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleFilter}>
                            Filtrar
                        </Button>
                    </InputGroup>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>DNI</th>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Nota Conceptual</th>
                            <th>Nota Procedimental</th>
                            <th>Nota Aptitudinal</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.dni}</td>
                                <td>{user.apellidos}</td>
                                <td>{user.nombres}</td>
                                <td>{user.notaConceptual || '-'}</td>
                                <td>{user.notaProcedimental || '-'}</td>
                                <td>{user.notaAptitudinal || '-'}</td>
                                <td>{user.promedio || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default NotaList;