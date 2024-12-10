import React, { useEffect } from 'react';
import { Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInformes } from '../../../redux/slices/informeSlice';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const DocumentLink = styled.a`
  color: #0066cc;
  &:hover {
    text-decoration: underline;
  }
`;

const VerEvaluaciones = () => {
    const dispatch = useDispatch();
    const informes = useSelector(state => state.informes.informes);
    const status = useSelector(state => state.informes.status);
    const userId = useSelector(state => state.auth.user?.id);

    useEffect(() => {
        dispatch(fetchInformes());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <StyledCard>
            <Card.Header>
                <h4>Mis Evaluaciones de Informes</h4>
            </Card.Header>
            <Card.Body>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Módulo</th>
                            <th>Fecha Entrega</th>
                            <th>Calificación</th>
                            <th>Estado</th>
                            <th>Observaciones</th>
                            <th>Documento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {informes.map(informe => (
                            <tr key={informe.id}>
                                <td>
                                    {informe.modulo_nombre}
                                    <br />
                                    <small className="text-muted">{informe.modulo_tipo}</small>
                                </td>
                                <td>{new Date(informe.fecha_entrega).toLocaleDateString()}</td>
                                <td>
                                    {informe.calificacion ?
                                        <span className="fw-bold">{informe.calificacion}</span> :
                                        'Pendiente'
                                    }
                                </td>
                                <td>
                                    <Badge bg={informe.calificacion ? 'success' : 'warning'}>
                                        {informe.calificacion ? 'Evaluado' : 'Pendiente'}
                                    </Badge>
                                </td>
                                <td>{informe.observaciones || '-'}</td>
                                <td>
                                    {informe.documento_url && (
                                        <DocumentLink
                                            href={informe.documento_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver Documento
                                        </DocumentLink>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {informes.length === 0 && (
                    <div className="text-center p-3">
                        No hay informes registrados
                    </div>
                )}
            </Card.Body>
        </StyledCard>
    );
};

export default VerEvaluaciones;
