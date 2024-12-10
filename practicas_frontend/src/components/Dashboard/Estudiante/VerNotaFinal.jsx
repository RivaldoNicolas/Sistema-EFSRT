import React, { useEffect } from 'react';
import { Card, Table, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPracticas } from '../../../redux/slices/practicasSlice';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const NotaBadge = styled.span`
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: bold;
  color: white;
  background-color: ${props => {
        const nota = Number(props.nota);
        if (nota >= 14) return '#28a745';
        if (nota >= 10.5) return '#ffc107';
        return '#dc3545';
    }};
`;

const formatNota = (nota) => {
    if (nota === null || nota === undefined) return 'Pendiente';
    const numNota = Number(nota);
    return isNaN(numNota) ? 'Error' : numNota.toFixed(2);
};

const VerNotaFinal = () => {
    const dispatch = useDispatch();
    const practicas = useSelector(state => state.practicas.items);
    const loading = useSelector(state => state.practicas.loading);

    useEffect(() => {
        dispatch(fetchPracticas());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <StyledCard>
            <Card.Header>
                <h4>Notas Finales de Prácticas</h4>
            </Card.Header>
            <Card.Body>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Módulo</th>
                            <th>Nota Asistencia (30%)</th>
                            <th>Nota Jurado (40%)</th>
                            <th>Nota Informe (30%)</th>
                            <th>Nota Final</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {practicas.map(practica => (
                            <tr key={practica.id}>
                                <td>
                                    {practica?.modulo?.nombre || 'N/A'}
                                    <br />
                                    <small className="text-muted">
                                        {practica?.modulo?.tipo_modulo || 'N/A'}
                                    </small>
                                </td>
                                <td>{formatNota(practica.nota_asistencia)}</td>
                                <td>{formatNota(practica.nota_jurado)}</td>
                                <td>{formatNota(practica.nota_informe)}</td>
                                <td>
                                    {practica.nota_final ? (
                                        <NotaBadge nota={practica.nota_final}>
                                            {formatNota(practica.nota_final)}
                                        </NotaBadge>
                                    ) : (
                                        'Pendiente'
                                    )}
                                </td>
                                <td>
                                    <span className={`badge bg-${practica.estado === 'EVALUADO' ? 'success' : 'warning'}`}>
                                        {practica.estado || 'PENDIENTE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {(!practicas || practicas.length === 0) && (
                    <div className="text-center p-3">
                        No hay prácticas registradas
                    </div>
                )}
            </Card.Body>
        </StyledCard>
    );
};

export default VerNotaFinal;
