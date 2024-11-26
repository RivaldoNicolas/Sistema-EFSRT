import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../redux/slices/userSlice';
import { Table, Form, Spinner } from 'react-bootstrap';

const EvaluacionForm = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [gradesData, setGradesData] = useState([]);
    const [evaluations, setEvaluations] = useState({
        estructura: 0,
        contenido: 0,
        coherencia: 0,
        recursos: 0,
        respuestas: 0
    });

    useEffect(() => {
        dispatch(fetchUsersByRole());
    }, [dispatch]);

    const handleInputChange = (field, value) => {
        setEvaluations(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateTotal = () => {
        const { estructura, contenido, coherencia, recursos, respuestas } = evaluations;
        return (estructura + contenido + coherencia + recursos + respuestas).toFixed(2);
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="text-center mb-4">
                <h3 className="fs-4 fw-bold">JURADO</h3>
            </div>

            <div className="container mb-4">
                <div className="row text-center">
                    <div className="col-3 border p-3">
                        <h5>Muy Buena</h5>
                        <p>4</p>
                    </div>
                    <div className="col-3 border p-3">
                        <h5>Buena</h5>
                        <p>3</p>
                    </div>
                    <div className="col-3 border p-3">
                        <h5>Aceptable</h5>
                        <p>2</p>
                    </div>
                    <div className="col-3 border p-3">
                        <h5>Deficiente</h5>
                        <p>1</p>
                    </div>
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
                            <th>Criterio</th>
                            <th>Calificación (0-4)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Estructura y organización del informe</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="4"
                                    value={evaluations.estructura}
                                    onChange={(e) => handleInputChange('estructura', Number(e.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Contenido y relevancia del informe</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="4"
                                    value={evaluations.contenido}
                                    onChange={(e) => handleInputChange('contenido', Number(e.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Coherencia y claridad en la exposición</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="4"
                                    value={evaluations.coherencia}
                                    onChange={(e) => handleInputChange('coherencia', Number(e.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Uso efectivo de apoyos visuales y recursos didácticos</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="4"
                                    value={evaluations.recursos}
                                    onChange={(e) => handleInputChange('recursos', Number(e.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Respuestas a preguntas y participación en la discusión</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="4"
                                    value={evaluations.respuestas}
                                    onChange={(e) => handleInputChange('respuestas', Number(e.target.value))}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>TOTAL</strong></td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={calculateTotal()}
                                    readOnly
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default EvaluacionForm;