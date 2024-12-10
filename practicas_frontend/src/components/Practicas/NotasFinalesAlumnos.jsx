import React, { useEffect, useState } from 'react';
import { Card, Table, Form, Spinner, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPracticasWithFilters } from '../../redux/slices/practicasSlice';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const NotaBadge = styled(Badge)`
  font-size: 0.9rem;
  padding: 0.5em 0.8em;
  background-color: ${props => {
        const nota = parseFloat(props.nota);
        if (nota >= 14) return '#28a745';  // Verde para notas altas
        if (nota >= 10.5) return '#ffc107'; // Amarillo para notas aprobatorias
        return '#dc3545';  // Rojo para notas desaprobatorias
    }};
`;

const NotasFinalesAlumnos = () => {
    const dispatch = useDispatch();
    const practicas = useSelector(state => state.practicas.items);
    const loading = useSelector(state => state.practicas.loading);
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');

    useEffect(() => {
        dispatch(fetchPracticasWithFilters({}));
    }, [dispatch]);

    const formatNota = (nota) => {
        if (nota === null || nota === undefined) return 'Pendiente';
        const numNota = parseFloat(nota);
        return isNaN(numNota) ? 'Error' : numNota.toFixed(2);
    };

    const getEstadoBadgeVariant = (estado) => {
        switch (estado) {
            case 'EVALUADO': return 'success';
            case 'EN_CURSO': return 'primary';
            case 'PENDIENTE': return 'warning';
            default: return 'secondary';
        }
    };

    const filteredPracticas = practicas.filter(practica => {
        const nombreCompleto = `${practica.estudiante?.first_name || ''} ${practica.estudiante?.last_name || ''}`.toLowerCase();
        const searchMatch = nombreCompleto.includes(searchTerm.toLowerCase());
        const moduleMatch = !moduleFilter || practica.modulo?.tipo_modulo === moduleFilter;
        return searchMatch && moduleMatch;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <StyledCard>
            <Card.Header>
                <h4 className="mb-3">Notas Finales de Alumnos</h4>
                <FilterContainer>
                    <Form.Control
                        type="search"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '300px' }}
                    />
                    <Form.Select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">Todos los módulos</option>
                        <option value="MODULO1">Módulo I</option>
                        <option value="MODULO2">Módulo II</option>
                        <option value="MODULO3">Módulo III</option>
                    </Form.Select>
                </FilterContainer>
            </Card.Header>
            <Card.Body>
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Módulo</th>
                            <th>Nota Asistencia (30%)</th>
                            <th>Nota Jurado (40%)</th>
                            <th>Nota Informe (30%)</th>
                            <th>Nota Final</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPracticas.map(practica => (
                            <tr key={practica.id}>
                                <td>
                                    <strong>{`${practica.estudiante?.first_name || ''} ${practica.estudiante?.last_name || ''}`}</strong>
                                </td>
                                <td>
                                    {practica.modulo?.nombre || 'N/A'}
                                    <br />
                                    <small className="text-muted">{practica.modulo?.tipo_modulo || 'N/A'}</small>
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
                                        <Badge bg="secondary">Pendiente</Badge>
                                    )}
                                </td>
                                <td>
                                    <Badge bg={getEstadoBadgeVariant(practica.estado)}>
                                        {practica.estado || 'PENDIENTE'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {filteredPracticas.length === 0 && (
                    <div className="text-center p-4">
                        <p className="text-muted">No se encontraron registros</p>
                    </div>
                )}
            </Card.Body>
        </StyledCard>
    );
};

export default NotasFinalesAlumnos;
