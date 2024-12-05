import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Spinner } from 'react-bootstrap';

const EvaluacionNotas = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const currentUser = useSelector(state => state.auth.user);
    const [gradesData, setGradesData] = useState([]);

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(fetchUsersByRole('ESTUDIANTE', currentUser.id));
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (users.length) {
            const currentUserData = users.filter(user => user.id === currentUser?.id);
            const initialData = currentUserData.map(user => ({
                id: user.id,
                nombre: user.nombre,
                conceptual: user.criterios_asistencia?.CONCEPTUAL || 0,
                procedimental: user.criterios_asistencia?.PROCEDIMENTAL || 0,
                actitudinal: user.criterios_asistencia?.ACTITUDINAL || 0,
                puntaje_diario: user.puntaje_diario || 0
            }));
            setGradesData(initialData);
        }
    }, [users, currentUser]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Evaluación de Notas</h3>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nota Conceptual</th>
                            <th>Nota Procedimental</th>
                            <th>Nota Actitudinal</th>
                            <th>Puntaje Diario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradesData.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.conceptual}</td>
                                <td>{entry.procedimental}</td>
                                <td>{entry.actitudinal}</td>
                                <td>{entry.puntaje_diario}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default EvaluacionNotas;