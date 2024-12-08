import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEvaluacion } from '../../redux/slices/juradosSlice';
import api from '../../services/api';
import {
    Card,
    Form,
    Button,
    Container,
    Row,
    Col,
    Spinner,
    Alert
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const EvaluacionForm = ({ practicaId, onSuccess }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formDisabled, setFormDisabled] = useState(false);
    const [formData, setFormData] = useState({
        calificacion: '',
        observaciones: '',
        criterios_evaluados: {
            presentacion: 0,
            conocimiento_teorico: 0,
            habilidades_practicas: 0,
            actitud_profesional: 0
        }
    });

    useEffect(() => {
        const verificarEvaluacionPrevia = async () => {
            try {
                const response = await api.get(`/evaluaciones/?practica=${practicaId}`);
                const yaEvaluado = response.data.some(evaluacion =>
                    evaluacion.jurado.id === user.id
                );

                if (yaEvaluado) {
                    setError("Ya has evaluado esta práctica anteriormente");
                    setFormDisabled(true);
                }
            } catch (error) {
                console.error('Error al verificar evaluaciones:', error);
            }
        };

        verificarEvaluacionPrevia();
    }, [practicaId, user.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const evaluacionData = {
                practica_id: parseInt(practicaId),
                calificacion: parseFloat(calculateFinalGrade()),
                observaciones: formData.observaciones,
                criterios_evaluados: {
                    presentacion: parseFloat(formData.criterios_evaluados.presentacion),
                    conocimiento_teorico: parseFloat(formData.criterios_evaluados.conocimiento_teorico),
                    habilidades_practicas: parseFloat(formData.criterios_evaluados.habilidades_practicas),
                    actitud_profesional: parseFloat(formData.criterios_evaluados.actitud_profesional)
                }
            };

            await dispatch(submitEvaluacion(evaluacionData)).unwrap();
            setSuccess(true);
            onSuccess?.();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateFinalGrade = () => {
        const { presentacion, conocimiento_teorico, habilidades_practicas, actitud_profesional } = formData.criterios_evaluados;
        return ((presentacion + conocimiento_teorico + habilidades_practicas + actitud_profesional) / 4).toFixed(2);
    };

    const resetForm = () => {
        setFormData({
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

    const validateForm = () => {
        const { criterios_evaluados } = formData;
        const hasValidGrades = Object.values(criterios_evaluados)
            .every(valor => valor >= 0 && valor <= 20);
        return hasValidGrades && formData.observaciones.trim().length > 0;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container className="py-4">
                <Card className="shadow">
                    <Card.Header className="bg-primary bg-gradient text-white py-3">
                        <h3 className="mb-0">Evaluación de Práctica Profesional</h3>
                    </Card.Header>
                    <Card.Body className="p-4">
                        {formDisabled && (
                            <Alert variant="warning" className="mb-4">
                                <div className="d-flex align-items-center">
                                    <FaExclamationTriangle className="me-2" size={20} />
                                    <div>
                                        <Alert.Heading className="mb-1">Evaluación ya realizada</Alert.Heading>
                                        <p className="mb-0">Ya has evaluado esta práctica anteriormente. No es posible realizar múltiples evaluaciones.</p>
                                    </div>
                                </div>
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Header className="bg-light">
                                    <h5 className="mb-0">Criterios de Evaluación</h5>
                                </Card.Header>
                                <Card.Body>
                                    {Object.entries(formData.criterios_evaluados).map(([criterio, valor]) => (
                                        <Form.Group key={criterio} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <Form.Label className="fw-bold mb-0">
                                                    {criterio.split('_').map(word =>
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                    ).join(' ')}
                                                </Form.Label>
                                                <span className="badge bg-primary px-3 py-2">
                                                    {valor}
                                                </span>
                                            </div>
                                            <Form.Range
                                                value={valor}
                                                onChange={(e) => handleCriterioChange(criterio, e.target.value)}
                                                min="0"
                                                max="20"
                                                step="0.5"
                                                disabled={formDisabled}
                                            />
                                        </Form.Group>
                                    ))}
                                </Card.Body>
                            </Card>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={formData.observaciones}
                                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                    placeholder="Ingrese sus observaciones sobre el desempeño del estudiante..."
                                    disabled={formDisabled}
                                    className="shadow-sm"
                                />
                            </Form.Group>

                            <div className="bg-light p-3 rounded mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Calificación Final:</h5>
                                    <h4 className="mb-0 text-primary">{calculateFinalGrade()}</h4>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    {error && (
                                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                            {error}
                                        </Alert>
                                    )}
                                    {success && (
                                        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                                            Evaluación guardada exitosamente
                                        </Alert>
                                    )}
                                </div>

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={resetForm}
                                        disabled={formDisabled}
                                    >
                                        <FaTimes className="me-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading || !validateForm() || formDisabled}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" className="me-2" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="me-2" />
                                                Guardar Evaluación
                                            </>
                                        )}
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
