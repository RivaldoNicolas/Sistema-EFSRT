import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { asignarJurado } from '../../redux/slices/moduloSlice';
import { showAlert } from '../../redux/slices/alertSlice';
import api from '../../services/api';

const AsignarJurado = () => {
    const [jurados, setJurados] = useState([]);
    const [selectedJurado, setSelectedJurado] = useState('');
    const [loading, setLoading] = useState(false);
    const [juradoActual, setJuradoActual] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moduloResponse, juradosResponse] = await Promise.all([
                    api.get(`/modulos/${id}/`),
                    api.get('/usuarios/', { params: { rol: 'JURADO' } })
                ]);

                if (moduloResponse.data.practica?.jurado) {
                    setJuradoActual(moduloResponse.data.practica.jurado);
                }
                setJurados(juradosResponse.data);
            } catch (error) {
                dispatch(showAlert({
                    type: 'error',
                    message: 'Error al cargar los datos'
                }));
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [id, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedJurado) return;

        setLoading(true);
        try {
            const result = await dispatch(asignarJurado({
                moduloId: id,
                juradoId: selectedJurado
            })).unwrap();

            dispatch(showAlert({
                type: 'success',
                message: result.message
            }));
            navigate(-1);
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error
            }));
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (juradoActual) {
        return (
            <div className="container mt-4">
                <Alert variant="info">
                    <Alert.Heading>Jurado ya asignado</Alert.Heading>
                    <p>
                        Este módulo ya tiene asignado al jurado:
                        <strong>{` ${juradoActual.first_name} ${juradoActual.last_name}`}</strong>
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Volver
                        </Button>
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Asignar Jurado</h2>
            {jurados.length > 0 ? (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccionar Jurado</Form.Label>
                        <Form.Select
                            value={selectedJurado}
                            onChange={(e) => setSelectedJurado(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un jurado</option>
                            {jurados.map(jurado => (
                                <option key={jurado.id} value={jurado.id}>
                                    {`${jurado.first_name} ${jurado.last_name}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || !selectedJurado}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Asignando...
                                </>
                            ) : (
                                'Asignar Jurado'
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            ) : (
                <Alert variant="warning">
                    No hay jurados disponibles para asignar.
                </Alert>
            )}
        </div>
    );
};

export default AsignarJurado;
