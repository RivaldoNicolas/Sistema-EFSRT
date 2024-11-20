import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { showAlert } from '../../../redux/slices/alertSlice';
import styled from 'styled-components';
import userService from '../../../services/userService';

const StyledCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ... imports permanecen igual

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            dispatch(showAlert({
                type: 'error',
                message: 'Las contraseñas nuevas no coinciden'
            }));
            return;
        }

        try {
            const response = await userService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            dispatch(showAlert({
                type: 'success',
                message: response.message
            }));

            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: error.response?.data?.error || 'Error al cambiar la contraseña'
            }));
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <StyledCard>
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">Cambiar Contraseña</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Actualizar Contraseña
                        </Button>
                    </Form>
                </Card.Body>
            </StyledCard>
        </motion.div>
    );
};

export default ChangePassword;
