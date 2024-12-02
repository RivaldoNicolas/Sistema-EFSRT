import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModulos, fetchJurados, asignarJurado } from '../../redux/slices/moduloSlice';
import { showAlert } from '../../redux/slices/alertSlice';
import { fetchUsersByRole } from "../../redux/slices/userSlice";

import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AsignarJurado = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const modulos = useSelector(state => state.modulos.modulos);
    const jurados = useSelector(state => state.modulos.jurados);
    const { estudiantes } = useSelector((state) => state.estudiantes);

    const [selectedModulo, setSelectedModulo] = useState('');
    const [selectedJurado, setSelectedJurado] = useState('');
    const [selectedEstudiante, setSelectedEstudiante] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                await dispatch(fetchModulos());
                await dispatch(fetchJurados());
                await dispatch(fetchUsersByRole('ESTUDIANTE'));
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        loadData();
    }, [dispatch]);

    console.log("Estudiantes en el componente:", estudiantes);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedModulo || !selectedJurado || !selectedEstudiante) {
            dispatch(showAlert({
                type: 'error',
                message: 'Debe seleccionar un módulo, un jurado y un estudiante.'
            }));
            return;
        }

        try {
            const datos = {
                modulo_id: selectedModulo,
                jurado_id: selectedJurado,
                encargado_id: user.id,
                estudiante_id: selectedEstudiante,
            };

            console.log("Datos a enviar:", datos);
            const result = await dispatch(asignarJurado(datos)).unwrap();
            console.log("Respuesta:", result);

            if (result.status === "success") {
                setSelectedModulo("");
                setSelectedJurado("");
                setSelectedEstudiante("");
                dispatch(showAlert({
                    type: 'success',
                    message: 'Jurado asignado exitosamente!'
                }));
            } else {
                dispatch(showAlert({
                    type: 'error',
                    message: 'Hubo un problema al asignar el jurado.'
                }));
            }
        } catch (error) {
            console.error("Error en la asignación:", error);
            dispatch(showAlert({
                type: 'error',
                message: 'Error en la asignación: ' + error.message
            }));
        }
    };

    return (
        <Container>
            <h2>Asignar Jurado</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="moduloSelect">
                            <Form.Control
                                as="select"
                                value={selectedModulo}
                                onChange={(e) => setSelectedModulo(e.target.value)}
                                aria-label="Seleccionar Módulo"
                            >
                                <option value="">Seleccione un módulo</option>
                                {modulos.map(modulo => (
                                    <option key={modulo.id} value={modulo.id}>
                                        {modulo.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="juradoSelect">
                            <Form.Control
                                as="select"
                                value={selectedJurado}
                                onChange={(e) => setSelectedJurado(e.target.value)}
                                aria-label="Seleccionar Jurado"
                            >
                                <option value="">Seleccione un jurado</option>
                                {jurados.map(jurado => (
                                    <option key={jurado.id} value={jurado.id}>
                                        {jurado.first_name} {jurado.last_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Select
                            value={selectedEstudiante}
                            onChange={(e) => setSelectedEstudiante(e.target.value)}
                            className="form-select"
                            style={{
                                color: '#000',
                                backgroundColor: '#fff',
                                border: '1px solid #ced4da'
                            }}
                        >
                            <option value="">Seleccione un estudiante</option>
                            {estudiantes.map((estudiante) => (
                                <option
                                    key={estudiante.id}
                                    value={estudiante.id}
                                    style={{ color: '#000' }}
                                >
                                    {estudiante.first_name} {estudiante.last_name}
                                </option>
                            ))}
                        </Form.Select>

                    </Col>
                </Row>

                <Button type="submit">Asignar Jurado</Button>
            </Form>
        </Container>
    );
};

export default AsignarJurado;