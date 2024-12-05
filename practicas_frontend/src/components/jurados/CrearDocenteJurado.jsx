import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAlert } from "../../redux/slices/alertSlice";
import api from "../../services/api";

const CrearDocenteJurado = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        rol: '',
        first_name: '',
        last_name: '',
        carrera: '',
        ciclo: '',
        boleta_pago: null,
        fut: null
    });

    const roles = ['DOCENTE', 'JURADO', 'ESTUDIANTE'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;

            if (userData.rol === 'ESTUDIANTE') {
                const formData = new FormData();
                Object.keys(userData).forEach(key => {
                    if (key === 'boleta_pago' || key === 'fut') {
                        if (userData[key]) {
                            formData.append(key, userData[key]);
                        }
                    } else {
                        formData.append(key, userData[key]);
                    }
                });
                data = formData;
            } else {
                // Para DOCENTE y JURADO usar JSON normal
                data = {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    rol: userData.rol,
                    first_name: userData.first_name,
                    last_name: userData.last_name
                };
            }

            const config = userData.rol === 'ESTUDIANTE'
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : { headers: { 'Content-Type': 'application/json' } };

            const response = await api.post('/usuarios/', data, config);

            dispatch(showAlert({
                type: 'success',
                message: 'Usuario creado exitosamente'
            }));

            // Resetear formulario
            setUserData({
                username: '',
                email: '',
                password: '',
                rol: '',
                first_name: '',
                last_name: '',
                carrera: '',
                ciclo: '',
                boleta_pago: null,
                fut: null
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
                <h3 className="mb-4">Crear Nuevo Usuario</h3>
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
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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

                    {userData.rol === 'ESTUDIANTE' && (
                        <>

                            <Form.Group className="mb-3">
                                <Form.Label>Carrera</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={userData.carrera}
                                    onChange={(e) => setUserData({ ...userData, carrera: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ciclo</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={userData.ciclo}
                                    onChange={(e) => setUserData({ ...userData, ciclo: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Boleta de Pago</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setUserData({ ...userData, boleta_pago: e.target.files[0] })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>FUT</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setUserData({ ...userData, fut: e.target.files[0] })}
                                />
                            </Form.Group>
                        </>
                    )}

                    <Button type="submit" variant="primary" className="w-100">
                        Crear Usuario
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CrearDocenteJurado;
