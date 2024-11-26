import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner, Button } from 'react-bootstrap';

const DiarioNot = ({ setCurrentComponent }) => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [gradesData, setGradesData] = useState([]);

    const handleVolver = () => {
        setCurrentComponent('diariod');
    };

    useEffect(() => {
        dispatch(fetchUsersByRole());
    }, [dispatch]);

    const handleInputChange = (userId, field, value) => {
        setGradesData((prevData) =>
            prevData.map((entry) =>
                entry.id === userId
                    ? { ...entry, [field]: value, promedio: calcularPromedio(entry, field, value) }
                    : entry
            )
        );
    };

    const calcularPromedio = (entry, field, value) => {
        const updatedEntry = { ...entry, [field]: parseFloat(value) || 0 };
        const { nota1, nota2, nota3 } = updatedEntry;
        return ((nota1 || 0) + (nota2 || 0) + (nota3 || 0)) / 3;
    };

    useEffect(() => {
        if (users.length) {
            const initialData = users.map(user => ({
                id: user.id,
                nombre: user.nombre,
                nota1: 0,
                nota2: 0,
                nota3: 0,
                promedio: 0
            }));
            setGradesData(initialData);
        }
    }, [users]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Evaluación de Notas</h3>
                <Button variant="secondary" onClick={handleVolver}>
                    Volver al listado
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>Nota Conceptual</th>
                            <th>Nota Procedimental</th>
                            <th>Nota Aptitudinal</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradesData.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.nombre}</td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={entry.nota1}
                                        onChange={(e) =>
                                            handleInputChange(entry.id, 'nota1', parseFloat(e.target.value))
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={entry.nota2}
                                        onChange={(e) =>
                                            handleInputChange(entry.id, 'nota2', parseFloat(e.target.value))
                                        }
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={entry.nota3}
                                        onChange={(e) =>
                                            handleInputChange(entry.id, 'nota3', parseFloat(e.target.value))
                                        }
                                    />
                                </td>
                                <td>{entry.promedio.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default DiarioNot;