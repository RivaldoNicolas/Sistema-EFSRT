import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { showAlert } from '../../../redux/slices/alertSlice';
import styled from 'styled-components';
import userService from '../../../services/userService';

const NAVY_BLUE = '#1a365d';
const LIGHT_BLUE = '#2563eb';

const StyledCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: none;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled(Card.Header)`
  background: linear-gradient(135deg, ${NAVY_BLUE} 0%, ${LIGHT_BLUE} 100%);
  color: white;
  padding: 1.5rem;
  border: none;

  h4 {
    font-weight: 600;
    letter-spacing: 0.5px;
    margin: 0;
  }
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 1.5rem;

  label {
    font-weight: 500;
    color: ${NAVY_BLUE};
    margin-bottom: 0.5rem;
  }

  input {
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;

    &:focus {
      border-color: ${LIGHT_BLUE};
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      outline: none;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  background: linear-gradient(135deg, ${LIGHT_BLUE} 0%, ${NAVY_BLUE} 100%);
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
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
            transition={{ duration: 0.3 }}
        >
            <StyledCard>
                <CardHeader>
                    <h4>Cambiar Contraseña</h4>
                </CardHeader>
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <StyledFormGroup>
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </StyledFormGroup>

                        <StyledFormGroup>
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                        </StyledFormGroup>

                        <StyledFormGroup>
                            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                        </StyledFormGroup>

                        <StyledButton type="submit">
                            Actualizar Contraseña
                        </StyledButton>
                    </Form>
                </Card.Body>
            </StyledCard>
        </motion.div>
    );
};

export default ChangePassword;
