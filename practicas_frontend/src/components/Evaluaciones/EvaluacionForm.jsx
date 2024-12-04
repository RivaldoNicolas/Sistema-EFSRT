import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEvaluacion } from '../../redux/slices/juradosSlice';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const EvaluacionForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        practica_id: '',
        calificacion: '',
        observaciones: '',
        criterios_evaluados: {
            presentacion: 0,
            conocimiento_teorico: 0,
            habilidades_practicas: 0,
            actitud_profesional: 0
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const evaluacionData = {
            ...formData,
            calificacion: calculateFinalGrade()
        };
        dispatch(submitEvaluacion(evaluacionData));
        resetForm();
    };

    const calculateFinalGrade = () => {
        const { presentacion, conocimiento_teorico, habilidades_practicas, actitud_profesional } = formData.criterios_evaluados;
        return ((presentacion + conocimiento_teorico + habilidades_practicas + actitud_profesional) / 4).toFixed(2);
    };

    const resetForm = () => {
        setFormData({
            practica_id: '',
            calificacion: '',
            observaciones: '',
            criterios_evaluados: {
                presentacion: 0,
                conocimiento_teorico: 0,
                habilidades_practicas: 0,
                actitud_profesional: 0
            }
        });
    };

    const handleCriterioChange = (criterio, valor) => {
        setFormData(prev => ({
            ...prev,
            criterios_evaluados: {
                ...prev.criterios_evaluados,
                [criterio]: parseFloat(valor)
            }
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="py-4">
                <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                        <h3 className="mb-0">Evaluación de Práctica Profesional</h3>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>ID de Práctica</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.practica_id}
                                            onChange={(e) => setFormData({ ...formData, practica_id: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Card className="mb-4">
                                <Card.Header>
                                    <h5 className="mb-0">Criterios de Evaluación</h5>
                                </Card.Header>
                                <Card.Body>
                                    {Object.entries(formData.criterios_evaluados).map(([criterio, valor]) => (
                                        <Form.Group key={criterio} className="mb-3">
                                            <Form.Label>
                                                {criterio.split('_').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')}
                                            </Form.Label>
                                            <div className="d-flex align-items-center">
                                                <Form.Range
                                                    value={valor}
                                                    onChange={(e) => handleCriterioChange(criterio, e.target.value)}
                                                    min="0"
                                                    max="20"
                                                    step="0.5"
                                                    className="me-3"
                                                />
                                                <span className="badge bg-primary" style={{ width: '3rem' }}>
                                                    {valor}
                                                </span>
                                            </div>
                                        </Form.Group>
                                    ))}
                                </Card.Body>
                            </Card>

                            <Form.Group className="mb-4">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={formData.observaciones}
                                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                    placeholder="Ingrese sus observaciones sobre el desempeño del estudiante..."
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between">
                                <h4>Calificación Final: {calculateFinalGrade()}</h4>
                                <div>
                                    <Button
                                        variant="secondary"
                                        className="me-2"
                                        onClick={resetForm}
                                    >
                                        <FaTimes className="me-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                    >
                                        <FaSave className="me-2" />
                                        Guardar Evaluación
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </motion.div>
    );
};

export default EvaluacionForm;
