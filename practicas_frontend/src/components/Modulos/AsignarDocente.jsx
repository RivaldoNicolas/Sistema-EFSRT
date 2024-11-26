import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../redux/slices/userSlice';
import { asignarDocente, fetchModuloDetails } from '../../redux/slices/moduloSlice';
import { showAlert } from '../../redux/slices/alertSlice';

const AsignarDocente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedDocente, setSelectedDocente] = useState('');
    const [loading, setLoading] = useState(false);

    const { users } = useSelector(state => state.users);
    const { selectedModulo } = useSelector(state => state.modulos);
    const docentes = users?.filter(user => user.rol === 'DOCENTE') || [];

    useEffect(() => {
        dispatch(fetchUsersByRole('DOCENTE'));
        dispatch(fetchModuloDetails(id));
    }, [dispatch, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id || !selectedDocente) return;

        setLoading(true);
        try {
            await dispatch(asignarDocente({
                moduloId: Number(id),
                docenteId: Number(selectedDocente)
            })).unwrap();

            dispatch(showAlert({
                message: 'Docente asignado exitosamente',
                type: 'success'
            }));

            dispatch(fetchModuloDetails(id));
            navigate(-1);
        } catch (error) {
            dispatch(showAlert({
                message: 'Error al asignar docente',
                type: 'error'
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header>
                <h5 className="mb-0">Asignar Docente al Módulo: {selectedModulo?.nombre}</h5>
            </Card.Header>
            <Card.Body>
                {selectedModulo?.docente ? (
                    <div className="mb-3">
                        <h6>Docente Actual:</h6>
                        <div className="d-flex align-items-center">
                            <Badge bg="success" className="me-2">Asignado</Badge>
                            <span>{selectedModulo.docente.first_name} {selectedModulo.docente.last_name}</span>
                        </div>
                    </div>
                ) : (
                    <Badge bg="warning" text="dark" className="mb-3">Sin Docente Asignado</Badge>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar Nuevo Docente</Form.Label>
                        <Form.Select
                            value={selectedDocente}
                            onChange={(e) => setSelectedDocente(e.target.value)}
                            required
                            disabled={loading}
                        >
                            <option value="">Seleccione un docente</option>
                            {docentes.map(docente => (
                                <option key={docente.id} value={docente.id}>
                                    {`${docente.first_name} ${docente.last_name}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Volver
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || !selectedDocente}
                        >
                            {loading ? 'Asignando...' : 'Asignar Docente'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AsignarDocente;
