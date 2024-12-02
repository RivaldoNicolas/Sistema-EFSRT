import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../redux/slices/alertSlice";
import api from "../../../services/api";

const CrearEstudiante = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        rol: '',
        first_name: '',
        last_name: ''
    });

    const roles = [

        'ESTUDIANTE'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/usuarios/', userData);
            dispatch(showAlert({
                type: 'success',
                message: 'Usuario creado exitosamente'
            }));
            setUserData({
                username: '',
                email: '',
                password: '',
                rol: '',
                first_name: '',
                last_name: ''
            });
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al crear usuario'
            }));
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <h3 className="mb-4">Crear Nuevo Estudiante</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de Usuario</Form.Label>
                        <Form.Control
                            type="text"
                            value={userData.username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            value={userData.rol}
                            onChange={(e) => setUserData({ ...userData, rol: e.target.value })}
                            required
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map(rol => (
                                <option key={rol} value={rol}>{rol}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                            type="text"
                            value={userData.first_name}
                            onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            value={userData.last_name}
                            onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">
                        Crear Usuario
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CrearEstudiante;