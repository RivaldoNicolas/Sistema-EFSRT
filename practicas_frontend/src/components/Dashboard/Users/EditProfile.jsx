import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { showAlert } from '../../../redux/slices/alertSlice';
import { updateUserProfile, fetchUserProfile } from '../../../redux/slices/userSlice';
import { updateUserProfile as updateUserProfileAction } from '../../../redux/slices/authSlice';

const StyledCard = styled(Card)`
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: none;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const roleLabels = {
    'ADMIN': 'Administrador General',
    'FUA': 'Encargado FUA',
    'PRACTICAS': 'Encargado EFSRT',
    'COORDINADOR': 'Coordinador Academico',
    'SECRETARIA': 'Secretaria',
    'DOCENTE': 'Docente',
    'ESTUDIANTE': 'Estudiante',
    'JURADO': 'Jurado Evaluador'
};

const EditProfile = ({ onCancel }) => {
    const user = useSelector(state => state.auth.user);
    const updateStatus = useSelector(state => state.users.updateStatus);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        telefono: user?.telefono || '',
        direccion: user?.direccion || '',
        edad: user?.edad || '',
        rol: user?.rol || '',
        carrera: user?.estudiante_data?.carrera || '',
        ciclo: user?.estudiante_data?.ciclo || '',
        boleta_pago: user?.estudiante_data?.boleta_pago || '',
        fut: user?.estudiante_data?.fut || ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'El username es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'El username debe tener al menos 3 caracteres';
        }

        if (!formData.first_name) newErrors.first_name = 'El nombre es requerido';
        if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';
        if (!formData.email) newErrors.email = 'El email es requerido';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (formData.telefono && !/^\d{9,}$/.test(formData.telefono)) {
            newErrors.telefono = 'Teléfono inválido (mínimo 9 dígitos)';
        }

        if (formData.edad && (formData.edad < 18 || formData.edad > 100)) {
            newErrors.edad = 'La edad debe estar entre 18 y 100 años';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            dispatch(showAlert({
                type: 'error',
                message: 'Por favor, corrija los errores en el formulario'
            }));
            return;
        }

        const formattedData = {
            id: user.id,
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            telefono: formData.telefono || "",
            direccion: formData.direccion || "",
            edad: formData.edad ? parseInt(formData.edad) : null,
            rol: user.rol,
            dni: user.dni || "",
            estudiante_data: user.estudiante_data
        };

        try {
            const resultAction = await dispatch(updateUserProfile(formattedData));

            if (resultAction.payload) {
                // Actualizar el estado global directamente
                dispatch(updateUserProfileAction(resultAction.payload));

                dispatch(showAlert({
                    type: 'success',
                    message: 'Perfil actualizado exitosamente'
                }));
                onCancel();

                // Forzar actualización del componente
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.message || 'Error al actualizar el perfil'
            }));
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <StyledCard>
                <Card.Header className="bg-primary text-white py-3">
                    <h4 className="mb-0">Editar Perfil</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username *</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                isInvalid={!!errors.first_name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.first_name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Apellido *</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                isInvalid={!!errors.last_name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.last_name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                isInvalid={!!errors.telefono}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.telefono}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                isInvalid={!!errors.direccion}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.direccion}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Edad</Form.Label>
                            <Form.Control
                                type="number"
                                name="edad"
                                value={formData.edad}
                                onChange={handleChange}
                                isInvalid={!!errors.edad}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.edad}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Control
                                type="text"
                                name="rol"
                                value={roleLabels[formData.rol] || formData.rol}
                                disabled
                            />
                        </Form.Group>

                        {formData.rol === 'ESTUDIANTE' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Carrera</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="carrera"
                                        value={formData.carrera}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Ciclo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="ciclo"
                                        value={formData.ciclo}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Boleta de Pago</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.boleta_pago ? 'Cargada' : 'Pendiente'}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>FUT</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.fut ? 'Cargado' : 'Pendiente'}
                                        disabled
                                    />
                                </Form.Group>
                            </>
                        )}

                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={onCancel}
                                disabled={updateStatus === 'loading'}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={updateStatus === 'loading'}
                            >
                                {updateStatus === 'loading' ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </StyledCard>
        </motion.div>
    );
};

export default EditProfile;
