import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner } from 'react-bootstrap';

const EvaluacionNotas = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users); // Obtiene usuarios y estado de carga desde Redux
    const [gradesData, setGradesData] = useState([]); // Estado local para almacenar las notas y promedios

    // Efecto para cargar usuarios al montar el componente
    useEffect(() => {
        dispatch(fetchUsersByRole());
    }, [dispatch]);

    // Manejo de cambios en las casillas de notas
    const handleInputChange = (userId, field, value) => {
        setGradesData((prevData) =>
            prevData.map((entry) =>
                entry.id === userId
                    ? { ...entry, [field]: value, promedio: calcularPromedio(entry, field, value) }
                    : entry
            )
        );
    };

    // Calcula el promedio dinámicamente
    const calcularPromedio = (entry, field, value) => {
        const updatedEntry = { ...entry, [field]: parseFloat(value) || 0 };
        const { nota1, nota2, nota3 } = updatedEntry;
        return ((nota1 || 0) + (nota2 || 0) + (nota3 || 0)) / 3; // Promedio de las tres notas
    };

    // Inicializa los datos de notas cuando se obtienen los usuarios
    useEffect(() => {
        if (users.length) {
            const initialData = users.map(user => ({
                id: user.id, // ID único del usuario
                nombre: user.nombre, // Nombre del usuario
                nota1: 0, // Nota 1 por defecto
                nota2: 0, // Nota 2 por defecto
                nota3: 0, // Nota 3 por defecto
                promedio: 0 // Promedio inicial
            }));
            setGradesData(initialData); // Actualiza el estado con los datos iniciales
        }
    }, [users]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Evaluación de Notas</h3> {/* Título de la tabla */}
            </div>

            {/* Muestra un spinner mientras se cargan los usuarios */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>NOMBRE</th> {/* Columna de nombres */}
                            <th>Nota Conceptual</th> {/* Columna para la primera nota */}
                            <th>Nota Procedimental</th> {/* Columna para la segunda nota */}
                            <th>Nota Aptitudinal</th> {/* Columna para la tercera nota */}
                            <th>Promedio</th> {/* Columna para el promedio */}
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
                                        value={entry.nota1} // Valor actual de la primera nota
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
                                        value={entry.nota2} // Valor actual de la segunda nota
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
                                        value={entry.nota3} // Valor actual de la tercera nota
                                        onChange={(e) =>
                                            handleInputChange(entry.id, 'nota3', parseFloat(e.target.value))
                                        }
                                    />
                                </td>
                                <td>{entry.promedio.toFixed(2)}</td> {/* Promedio con dos decimales */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default EvaluacionNotas;