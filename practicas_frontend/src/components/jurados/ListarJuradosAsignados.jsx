import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModulos, listarJuradosAsignados } from '../../redux/slices/moduloSlice';

const ListarJuradosAsignados = () => {
    const dispatch = useDispatch();
    const [selectedModulo, setSelectedModulo] = useState('');
    const { modulos, juradosAsignados, loading, error } = useSelector((state) => state.modulos);

    useEffect(() => {
        dispatch(fetchModulos());
    }, [dispatch]);

    useEffect(() => {
        if (selectedModulo) {
            dispatch(listarJuradosAsignados(selectedModulo));
        }
    }, [selectedModulo, dispatch]);

    return (
        <Container fluid>
            <Row className="mt-4">
                <Col>
                    <h4 className="mb-4">Jurados y Estudiantes por Módulo</h4>

                    <Form.Group className="mb-4">
                        <Form.Label>Seleccione un Módulo</Form.Label>
                        <Form.Select
                            value={selectedModulo}
                            onChange={(e) => setSelectedModulo(e.target.value)}
                        >
                            <option value="">Seleccione un módulo...</option>
                            {modulos.map((modulo) => (
                                <option key={modulo.id} value={modulo.id}>
                                    {modulo.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : juradosAsignados.length > 0 ? (
                        juradosAsignados.map((jurado) => (
                            <Card key={jurado.jurado__id} className="mb-4">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">
                                        Jurado: {jurado.jurado__first_name}
                                    </h5>
                                    <small>Usuario: {jurado.jurado__username}</small>
                                </Card.Header>
                                <Card.Body>
                                    {jurado.estudiantes.length > 0 ? (
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Estudiante</th>
                                                    <th>Estado</th>
                                                    <th>Fecha Asignación</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jurado.estudiantes.map((estudiante, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{estudiante.nombre}</td>
                                                        <td>
                                                            <span className={`badge bg-${estudiante.estado === 'PENDIENTE'
                                                                    ? 'warning'
                                                                    : 'success'
                                                                }`}>
                                                                {estudiante.estado}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {new Date(estudiante.fecha_asignacion).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <Alert variant="info">
                                            No hay estudiantes asignados a este jurado
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <Alert variant="info">
                            No hay jurados asignados para este módulo
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ListarJuradosAsignados;
