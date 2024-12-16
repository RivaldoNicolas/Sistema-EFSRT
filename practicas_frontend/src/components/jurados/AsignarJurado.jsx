import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModulos, fetchJurados, asignarJurado } from '../../redux/slices/moduloSlice';
import { showAlert } from '../../redux/slices/alertSlice';
import { fetchUsersByRole } from "../../redux/slices/userSlice";
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const AsignarJurado = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const modulos = useSelector(state => state.modulos.modulos);
    const jurados = useSelector(state => state.modulos.jurados);
    const { estudiantes } = useSelector((state) => state.estudiantes);

    const [selectedModulo, setSelectedModulo] = useState('');
    const [selectedJurado, setSelectedJurado] = useState('');
    const [selectedEstudiante, setSelectedEstudiante] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchModulos()),
                    dispatch(fetchJurados()),
                    dispatch(fetchUsersByRole('ESTUDIANTE'))
                ]);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        loadData();
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedModulo || !selectedJurado || !selectedEstudiante) {
            dispatch(showAlert({
                type: 'error',
                message: 'Debe seleccionar un módulo, un jurado y un estudiante.'
            }));
            return;
        }

        try {
            const result = await dispatch(asignarJurado({
                modulo_id: selectedModulo,
                jurado_id: selectedJurado,
                encargado_id: user.id,
                estudiante_id: selectedEstudiante,
            })).unwrap();

            if (result.status === "success") {
                setSelectedModulo("");
                setSelectedJurado("");
                setSelectedEstudiante("");
                dispatch(showAlert({
                    type: 'success',
                    message: 'Jurado asignado exitosamente!'
                }));
            }
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: 'Error en la asignación: ' + error.message
            }));
        }
    };

    return (
        <Container fluid className="px-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom py-3">
                    <h4 className="mb-0 text-primary">
                        <i className="fas fa-user-plus me-2"></i>
                        Asignación de Jurado
                    </h4>
                </Card.Header>
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-book me-2"></i>
                                        Módulo
                                    </Form.Label>
                                    <Form.Select
                                        value={selectedModulo}
                                        onChange={(e) => setSelectedModulo(e.target.value)}
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

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-user-tie me-2"></i>
                                        Jurado
                                    </Form.Label>
                                    <Form.Select
                                        value={selectedJurado}
                                        onChange={(e) => setSelectedJurado(e.target.value)}
                                        className="form-select-lg"
                                    >
                                        <option value="">Seleccione un jurado</option>
                                        {jurados.map(jurado => (
                                            <option key={jurado.id} value={jurado.id}>
                                                {jurado.first_name} {jurado.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">
                                        <i className="fas fa-user-graduate me-2"></i>
                                        Estudiante
                                    </Form.Label>
                                    <Form.Select
                                        value={selectedEstudiante}
                                        onChange={(e) => setSelectedEstudiante(e.target.value)}
                                        className="form-select-lg"
                                    >
                                        <option value="">Seleccione un estudiante</option>
                                        {estudiantes.map((estudiante) => (
                                            <option key={estudiante.id} value={estudiante.id}>
                                                {estudiante.first_name} {estudiante.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="px-4"
                                variant="primary"
                            >
                                <i className="fas fa-save me-2"></i>
                                Asignar Jurado
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AsignarJurado;
