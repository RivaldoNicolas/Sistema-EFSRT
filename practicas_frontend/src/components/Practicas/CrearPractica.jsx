import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Card } from 'react-bootstrap';
import { fetchModulos } from '../../redux/slices/moduloSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { createPractica } from '../../redux/slices/practicasSlice';
import { showAlert } from '../../redux/slices/alertSlice';


const CrearPractica = () => {
    const dispatch = useDispatch();
    const modulos = useSelector(state => state.modulos.modulos) || [];
    const users = useSelector(state => state.users.items) || [];

    const estudiantes = users.filter(user => user.rol === 'ESTUDIANTE');
    const docentes = users.filter(user => user.rol === 'DOCENTE');

    const [formData, setFormData] = useState({
        modulo: '',
        estudiante: '',
        supervisor: '',
        fecha_inicio: '',
        fecha_fin: '',  // Agregamos fecha_fin
        estado: 'PENDIENTE'  // Cambiamos el estado inicial
    });

    // Cargamos los datos al montar el componente
    useEffect(() => {
        dispatch(fetchModulos());
        dispatch(fetchUsers());
    }, [dispatch]);

    const isLoading = useSelector(state => state.modulos.loading || state.users.loading);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            modulo: Number(formData.modulo),
            estudiante: Number(formData.estudiante),
            supervisor: Number(formData.supervisor)
        };

        try {
            const resultAction = await dispatch(createPractica(dataToSend)).unwrap();
            dispatch(showAlert({
                type: 'success',
                message: '¡Práctica creada exitosamente!'
            }));
            // Limpiar formulario
            setFormData({
                modulo: '',
                estudiante: '',
                supervisor: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: 'PENDIENTE'
            });
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.message || 'Error al crear la práctica'
            }));
        }
    };



    if (isLoading) {
        return <div>Cargando datos...</div>;
    }

    return (
        <Card className="shadow">
            <Card.Header className="bg-primary text-white">
                <h3>Crear Nueva Práctica</h3>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Módulo</Form.Label>
                        <Form.Select
                            value={formData.modulo}
                            onChange={e => setFormData({ ...formData, modulo: e.target.value })}
                            required
                        >
                            <option value="">Seleccione un módulo</option>
                            {modulos.map(modulo => (
                                <option key={modulo.id} value={modulo.id}>
                                    {modulo.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estudiante</Form.Label>
                        <Form.Select
                            value={formData.estudiante}
                            onChange={e => setFormData({ ...formData, estudiante: e.target.value })}
                            required
                        >
                            <option value="">Seleccione un estudiante</option>
                            {estudiantes.map(estudiante => (
                                <option key={estudiante.id} value={estudiante.id}>
                                    {`${estudiante.first_name} ${estudiante.last_name}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Supervisor</Form.Label>
                        <Form.Select
                            value={formData.supervisor}
                            onChange={e => setFormData({ ...formData, supervisor: e.target.value })}
                            required
                        >
                            <option value="">Seleccione un supervisor</option>
                            {docentes.map(docente => (
                                <option key={docente.id} value={docente.id}>
                                    {`${docente.first_name} ${docente.last_name}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.fecha_inicio}
                            onChange={e => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Crear Práctica
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CrearPractica;