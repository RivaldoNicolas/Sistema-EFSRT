import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Spinner, Badge, Button } from 'react-bootstrap';
import { fetchAsistenciasPractica } from '../../../redux/slices/docenteSlice';

const Asistencia = ({ practiceId }) => { // Assume practiceId is passed as a prop
    const dispatch = useDispatch();
    const { asistencias, loading } = useSelector(state => state.docente);
    const { user } = useSelector(state => state.auth); // Obtener usuario autenticado

    useEffect(() => {
        // Verificar autenticación y datos del usuario
        if (user?.id) {
            dispatch(fetchAsistenciasPractica(user.id));
        }
    }, [dispatch, user]);

    const handleReload = () => {
        if (user?.practicas?.[0]?.id) {
            dispatch(fetchAsistenciasPractica(user.practicas[0].id));
        }
    };



    const getBadgeColor = (status) => {
        switch (status) {
            case 'PRESENTE':
                return 'success';
            case 'FALTA':
                return 'danger';
            case 'TARDANZA':
                return 'warning';
            default:
                return 'secondary';
        }
    };



    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Registro de Asistencias</h3>
                <Button onClick={handleReload} variant="outline-primary">
                    Recargar
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Asistencia</th>
                            <th>Puntualidad</th>
                            <th>Criterios de Evaluación</th>
                            <th>Puntaje Diario</th>
                            <th>Puntaje General</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asistencias.map((asistencia) => (
                            <tr key={asistencia.id}>
                                <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                                <td>
                                    <Badge bg={getBadgeColor(asistencia.asistio)}>
                                        {asistencia.asistio}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge bg={getBadgeColor(asistencia.puntualidad)}>
                                        {asistencia.puntualidad}
                                    </Badge>
                                </td>
                                <td>
                                    <div>Conceptual: {asistencia.criterios_asistencia.CONCEPTUAL}</div>
                                    <div>Procedimental: {asistencia.criterios_asistencia.PROCEDIMENTAL}</div>
                                    <div>Actitudinal: {asistencia.criterios_asistencia.ACTITUDINAL}</div>
                                </td>
                                <td>{asistencia.puntaje_diario}</td>
                                <td>{asistencia.puntaje_general}</td>
                            </tr>
                        ))}
                        {asistencias.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay registros de asistencia disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Asistencia;