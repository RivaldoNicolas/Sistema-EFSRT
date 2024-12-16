import React, { useEffect, useState } from 'react';
import { Table, Alert, Form, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModulos, listarJuradosAsignados } from '../../redux/slices/moduloSlice';

const ListarJuradosAsignados = () => {
    const dispatch = useDispatch();
    const [selectedModulo, setSelectedModulo] = useState('');
    const { modulos, juradosAsignados, error } = useSelector((state) => state.modulos);

    useEffect(() => {
        dispatch(fetchModulos());
    }, [dispatch]);

    useEffect(() => {
        if (selectedModulo) {
            dispatch(listarJuradosAsignados(selectedModulo));
        }
    }, [selectedModulo, dispatch]);

    return (
        <Container fluid className="px-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom py-3">
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h4 className="mb-0 text-primary">
                                <i className="fas fa-users-cog me-2"></i>
                                Gestión de Jurados por Módulo
                            </h4>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-0">
                                <Form.Select
                                    value={selectedModulo}
                                    onChange={(e) => setSelectedModulo(e.target.value)}
                                    className="form-select-lg"
                                >
                                    <option value="">Seleccione un módulo...</option>
                                    {modulos.map((modulo) => (
                                        <option key={modulo.id} value={modulo.id}>
                                            {modulo.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body className="p-0">
                    {error ? (
                        <Alert variant="danger" className="m-3">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {error}
                        </Alert>
                    ) : juradosAsignados.length > 0 ? (
                        <div className="p-3">
                            {juradosAsignados.map((jurado) => (
                                <Card key={jurado.jurado__id} className="mb-4 border">
                                    <Card.Header className="bg-gradient bg-primary text-white py-3">
                                        <Row className="align-items-center">
                                            <Col>
                                                <h5 className="mb-0">
                                                    <i className="fas fa-user-tie me-2"></i>
                                                    {jurado.jurado__first_name}
                                                </h5>
                                            </Col>
                                            <Col className="text-end">
                                                <Badge bg="light" text="primary">
                                                    {jurado.jurado__username}
                                                </Badge>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        {jurado.estudiantes.length > 0 ? (
                                            <Table hover responsive className="mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th>Estudiante</th>
                                                        <th className="text-center">Estado</th>
                                                        <th className="text-center">Fecha Asignación</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {jurado.estudiantes.map((estudiante, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>
                                                                <i className="fas fa-user-graduate me-2"></i>
                                                                {estudiante.nombre}
                                                            </td>
                                                            <td className="text-center">
                                                                <Badge bg={estudiante.estado === 'PENDIENTE' ? 'warning' : 'success'}>
                                                                    <i className={`fas fa-${estudiante.estado === 'PENDIENTE' ? 'clock' : 'check'} me-1`}></i>
                                                                    {estudiante.estado}
                                                                </Badge>
                                                            </td>
                                                            <td className="text-center">
                                                                <i className="far fa-calendar-alt me-2"></i>
                                                                {new Date(estudiante.fecha_asignacion).toLocaleDateString('es-ES', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <Alert variant="info" className="m-3">
                                                <i className="fas fa-info-circle me-2"></i>
                                                No hay estudiantes asignados a este jurado
                                            </Alert>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    ) : selectedModulo && (
                        <Alert variant="info" className="m-3">
                            <i className="fas fa-info-circle me-2"></i>
                            No hay jurados asignados para este módulo
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ListarJuradosAsignados;
