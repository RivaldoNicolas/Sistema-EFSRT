import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { fetchModulos } from '../../redux/slices/moduloSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { createPractica } from '../../redux/slices/practicasSlice';
import { showAlert } from '../../redux/slices/alertSlice';

const CrearPractica = () => {
    const dispatch = useDispatch();
    const modulos = useSelector(state => state.modulos.modulos) || [];
    const users = useSelector(state => state.users.items) || [];

    const estudiantes = users.filter(user => user.rol === 'ESTUDIANTE');
    const docentes = users.filter(user => user.rol === 'DOCENTE');

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        modulo: '',
        estudiante: '',
        supervisores: [], // Changed to array for multiple supervisors
        fecha_inicio: getCurrentDate(),
        estado: 'PENDIENTE'
    });

    useEffect(() => {
        dispatch(fetchModulos());
        dispatch(fetchUsers());
    }, [dispatch]);

    const isLoading = useSelector(state => state.modulos.loading || state.users.loading);

    const handleSupervisorChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({
            ...formData,
            supervisores: selectedOptions
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);

        if (!formData.modulo || !formData.estudiante || formData.supervisores.length === 0) {
            dispatch(showAlert({
                type: 'error',
                message: 'Todos los campos son requeridos'
            }));
            return;
        }

        const dataToSend = {
            modulo: Number(formData.modulo),
            estudiante: Number(formData.estudiante),
            supervisores: formData.supervisores.map(Number),
            fecha_inicio: formData.fecha_inicio,
            estado: formData.estado
        };

        try {
            await dispatch(createPractica(dataToSend)).unwrap();
            dispatch(showAlert({
                type: 'success',
                message: '¡Práctica creada exitosamente!'
            }));
            setFormData({
                modulo: '',
                estudiante: '',
                supervisores: [],
                fecha_inicio: getCurrentDate(),
                estado: 'PENDIENTE'
            });
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.message || 'Error al crear la práctica'
            }));
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="px-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-gradient bg-primary text-white py-3">
                    <h4 className="mb-0">
                        <i className="fas fa-plus-circle me-2"></i>
                        Nueva Práctica
                    </h4>
                </Card.Header>
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-book me-2"></i>
                                        Módulo
                                    </Form.Label>
                                    <Form.Select
                                        value={formData.modulo}
                                        onChange={e => setFormData({ ...formData, modulo: e.target.value })}
                                        required
                                        className="form-select-lg"
                                    >
                                        <option value="">Seleccione un módulo</option>
                                        {modulos.map(modulo => (
                                            <option key={modulo.id} value={modulo.id}>
                                                {modulo.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-user-graduate me-2"></i>
                                        Estudiante
                                    </Form.Label>
                                    <Form.Select
                                        value={formData.estudiante}
                                        onChange={e => setFormData({ ...formData, estudiante: e.target.value })}
                                        required
                                        className="form-select-lg"
                                    >
                                        <option value="">Seleccione un estudiante</option>
                                        {estudiantes.map(estudiante => (
                                            <option key={estudiante.id} value={estudiante.id}>
                                                {`${estudiante.first_name} ${estudiante.last_name}`}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-chalkboard-teacher me-2"></i>
                                        Docentes Supervisores
                                    </Form.Label>
                                    <Form.Select
                                        multiple
                                        value={formData.supervisores}
                                        onChange={handleSupervisorChange}
                                        required
                                        className="form-select-lg"
                                        style={{ height: '120px' }}
                                    >
                                        {docentes.map(docente => (
                                            <option key={docente.id} value={docente.id}>
                                                {`${docente.first_name} ${docente.last_name}`}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Mantenga presionado Ctrl (Cmd en Mac) para seleccionar múltiples docentes
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-calendar-alt me-2"></i>
                                        Fecha de Inicio
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.fecha_inicio}
                                        disabled
                                        className="form-control-lg bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                className="px-4"
                            >
                                <i className="fas fa-save me-2"></i>
                                Crear Práctica
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CrearPractica;
