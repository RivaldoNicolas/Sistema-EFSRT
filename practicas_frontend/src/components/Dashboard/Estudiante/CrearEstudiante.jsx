import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../redux/slices/alertSlice';

const CrearEstudiante = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        telefono: '',
        direccion: '',
        edad: '',
        // Datos adicionales del estudiante
        carrera: '',
        ciclo: '',
        codigo_estudiante: '',
        semestre: '',
        grupo: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/estudiantes/crear/', formData);
            dispatch(showAlert({
                type: 'success',
                message: 'Estudiante creado exitosamente'
            }));
            setFormData({
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                telefono: '',
                direccion: '',
                edad: '',
                carrera: '',
                ciclo: '',
                codigo_estudiante: '',
                semestre: '',
                grupo: ''
            });
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al crear estudiante'
            }));
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Crear Nuevo Estudiante</h4>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <h5 className="mb-3">Datos de Usuario</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <h5 className="mb-3">Datos Personales</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col md={12}>
                            <h5 className="mb-3">Datos Académicos</h5>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Carrera</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.carrera}
                                    onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ciclo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.ciclo}
                                    onChange={(e) => setFormData({ ...formData, ciclo: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Código de Estudiante</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.codigo_estudiante}
                                    onChange={(e) => setFormData({ ...formData, codigo_estudiante: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Grupo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.grupo}
                                    onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="text-end mt-4">
                        <Button type="submit" variant="primary">
                            Crear Estudiante
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CrearEstudiante;
