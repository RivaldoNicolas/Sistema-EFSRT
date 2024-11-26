import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner } from 'react-bootstrap';

const Asistencia = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        dispatch(fetchUsersByRole());
    }, [dispatch]);

    // Manejo de cambios en las casillas
    const handleInputChange = (userId, field, value) => {
        setAttendanceData((prevData) =>
            prevData.map((entry) =>
                entry.id === userId ? { ...entry, [field]: value } : entry
            )
        );
    };

    useEffect(() => {
        // Inicializar los datos de asistencia con los usuarios
        if (users.length) {
            const initialData = users.map(user => ({
                id: user.id,
                fecha: new Date().toLocaleDateString(),
                asistio: 0, // Valor por defecto
                puntualidad: 0 // Valor por defecto
            }));
            setAttendanceData(initialData);
        }
    }, [users]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Asistencia</h3>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Asistió</th>
                            <th>P-T</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.fecha}</td>
                                <td>
                                    <Form.Control
                                        as="select"
                                        value={entry.asistio}
                                        onChange={(e) =>
                                            handleInputChange(entry.id, 'asistio', parseInt(e.target.value))
                                        }
                                    >
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                    </Form.Control>
                                </td>
                                <td>
                                    <Form.Control
                                        as="select"
                                        value={entry.puntualidad}
                                        onChange={(e) =>
                                            handleInputChange(entry.id, 'puntualidad', parseInt(e.target.value))
                                        }
                                    >
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                    </Form.Control>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Asistencia;