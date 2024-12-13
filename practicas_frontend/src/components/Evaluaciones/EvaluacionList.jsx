import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvaluaciones, deleteEvaluacion } from '../../redux/slices/juradosSlice';
import { Table, Form, InputGroup, Button, Badge, Spinner, Card, Row, Col } from 'react-bootstrap';
import { FaSearch, FaFilter, FaUser, FaStar, FaFileAlt, FaTrash, FaBookOpen } from 'react-icons/fa';
import { showAlert } from '../../redux/slices/alertSlice';

const EvaluacionList = () => {
    const dispatch = useDispatch();
    const evaluaciones = useSelector(state => state.jurado.evaluaciones);
    const status = useSelector(state => state.jurado.status);
    const usuarioActual = useSelector(state => state.auth.user);

    const [searchTerm, setSearchTerm] = useState('');
    const [calificacionFilter, setCalificacionFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        dispatch(fetchEvaluaciones())
            .unwrap()
            .catch(error => {
                dispatch(showAlert({
                    type: 'error',
                    message: 'Error al cargar las evaluaciones: ' + error.message
                }));
            });
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta evaluación?')) {
            try {
                await dispatch(deleteEvaluacion(id)).unwrap();
                dispatch(showAlert({
                    type: 'success',
                    message: 'Evaluación eliminada exitosamente'
                }));
            } catch (error) {
                dispatch(showAlert({
                    type: 'error',
                    message: 'Error al eliminar la evaluación: ' + error.message
                }));
            }
        }
    };

    const filteredEvaluaciones = evaluaciones.filter(evaluacion => {
        const searchString = searchTerm.toLowerCase();
        const matchesSearch =
            evaluacion.practica_details?.estudiante?.first_name?.toLowerCase().includes(searchString) ||
            evaluacion.practica_details?.estudiante?.last_name?.toLowerCase().includes(searchString) ||
            evaluacion.observaciones?.toLowerCase().includes(searchString);

        const matchesCalificacion =
            calificacionFilter === '' ||
            evaluacion.calificacion.toString() === calificacionFilter;

        return matchesSearch && matchesCalificacion;
    });

    const sortedEvaluaciones = [...filteredEvaluaciones].sort((a, b) => {
        return sortOrder === 'desc'
            ? b.calificacion - a.calificacion
            : a.calificacion - b.calificacion;
    });

    const getCalificacionColor = (calificacion) => {
        if (calificacion >= 15) return 'success';
        if (calificacion >= 11) return 'warning';
        return 'danger';
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderEstudianteInfo = (evaluacion) => {
        const estudiante = evaluacion.practica_details?.estudiante;
        return estudiante ? (
            <div className="d-flex align-items-center">
                <FaUser className="me-2 text-primary" />
                {`${estudiante.first_name} ${estudiante.last_name}`}
            </div>
        ) : 'N/A';
    };

    const renderModuloInfo = (evaluacion) => {
        const modulo = evaluacion.practica_details?.modulo;
        return modulo ? (
            <div className="d-flex align-items-center">
                <FaBookOpen className="me-2 text-info" />
                {modulo.nombre}
            </div>
        ) : 'N/A';
    };

    if (status === 'loading') {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <Card>
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-0">Mis Evaluaciones</h2>
                            <small>Jurado: {usuarioActual?.first_name} {usuarioActual?.last_name}</small>
                        </div>
                        <Badge bg="light" text="dark" className="fs-6">
                            Total: {sortedEvaluaciones.length}
                        </Badge>
                    </div>
                </Card.Header>

                <Card.Body>
                    <Row className="mb-4">
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar por estudiante u observaciones..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaStar />
                                </InputGroup.Text>
                                <Form.Select
                                    value={calificacionFilter}
                                    onChange={(e) => setCalificacionFilter(e.target.value)}
                                >
                                    <option value="">Todas las calificaciones</option>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                                        <option key={num} value={num}>
                                            Nota: {num}
                                        </option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaFilter />
                                </InputGroup.Text>
                                <Form.Select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="desc">Mayor calificación primero</option>
                                    <option value="asc">Menor calificación primero</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Row>

                    {sortedEvaluaciones.length > 0 ? (
                        <Table striped bordered hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Módulo</th>
                                    <th>Calificación</th>
                                    <th>Observaciones</th>
                                    <th>Fecha Evaluación</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEvaluaciones.map((evaluacion) => (
                                    <tr key={evaluacion.id}>
                                        <td>{renderEstudianteInfo(evaluacion)}</td>
                                        <td>{renderModuloInfo(evaluacion)}</td>
                                        <td>
                                            <Badge bg={getCalificacionColor(evaluacion.calificacion)}>
                                                {evaluacion.calificacion}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaFileAlt className="me-2 text-muted" />
                                                {evaluacion.observaciones}
                                            </div>
                                        </td>
                                        <td>{formatFecha(evaluacion.fecha_evaluacion)}</td>
                                        <td>
                                            <Badge bg={evaluacion.practica_details?.estado === 'EVALUADO' ? 'success' : 'warning'}>
                                                {evaluacion.practica_details?.estado || 'PENDIENTE'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(evaluacion.id)}
                                            >
                                                <FaTrash /> Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center p-5">
                            <FaFileAlt size={48} className="text-muted mb-3" />
                            <h4 className="text-muted">No hay evaluaciones disponibles</h4>
                            <p className="text-muted">
                                No se encontraron evaluaciones que coincidan con los criterios de búsqueda.
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default EvaluacionList;
