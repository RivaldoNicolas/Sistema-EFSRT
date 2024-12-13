import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvaluacionesJurado } from '../../../redux/slices/estudiantesSlice';
import { Table, Badge, Card, Spinner } from 'react-bootstrap';
import { FaUser, FaBookOpen, FaStar, FaFileAlt } from 'react-icons/fa';

const VerEvaluacionesJurados = () => {
    const dispatch = useDispatch();
    const evaluaciones = useSelector(state => state.estudiantes.evaluacionesJurado || []);
    const status = useSelector(state => state.estudiantes.status);
    const usuario = useSelector(state => state.auth.user);

    useEffect(() => {
        dispatch(fetchEvaluacionesJurado());
    }, [dispatch]);

    const getCalificacionColor = (calificacion) => {
        if (calificacion >= 15) return 'success';
        if (calificacion >= 11) return 'warning';
        return 'danger';
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            <h2 className="mb-0">Mis Evaluaciones Recibidas</h2>
                            <small>Estudiante: {usuario?.first_name} {usuario?.last_name}</small>
                        </div>
                        <Badge bg="light" text="dark" className="fs-6">
                            Total: {Array.isArray(evaluaciones) ? evaluaciones.length : 0}
                        </Badge>
                    </div>
                </Card.Header>

                <Card.Body>
                    {Array.isArray(evaluaciones) && evaluaciones.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead className="bg-light">
                                <tr>
                                    <th>Jurado</th>
                                    <th>Módulo</th>
                                    <th>Calificación</th>
                                    <th>Criterios Evaluados</th>
                                    <th>Observaciones</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluaciones.map((evaluacion) => (
                                    <tr key={evaluacion.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaUser className="me-2 text-primary" />
                                                {evaluacion.jurado ?
                                                    `${evaluacion.jurado.first_name} ${evaluacion.jurado.last_name}` :
                                                    'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaBookOpen className="me-2 text-info" />
                                                {evaluacion.practica?.modulo?.nombre || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg={getCalificacionColor(evaluacion.calificacion)}>
                                                {evaluacion.calificacion}
                                            </Badge>
                                        </td>
                                        <td>
                                            {evaluacion.criterios_evaluados && (
                                                <div>
                                                    {Object.entries(evaluacion.criterios_evaluados).map(([criterio, valor]) => (
                                                        <div key={criterio} className="mb-1">
                                                            <FaStar className="text-warning me-1" />
                                                            <strong>{criterio}:</strong> {valor}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <FaFileAlt className="me-2 text-muted" />
                                                {evaluacion.observaciones || 'Sin observaciones'}
                                            </div>
                                        </td>
                                        <td>{evaluacion.fecha_evaluacion ?
                                            formatFecha(evaluacion.fecha_evaluacion) :
                                            'Fecha no disponible'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center p-5">
                            <FaFileAlt size={48} className="text-muted mb-3" />
                            <h4 className="text-muted">No hay evaluaciones disponibles</h4>
                            <p className="text-muted">Aún no has recibido evaluaciones de los jurados.</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default VerEvaluacionesJurados;
