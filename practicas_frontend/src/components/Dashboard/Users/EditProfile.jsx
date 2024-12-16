import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { showAlert } from '../../../redux/slices/alertSlice';
import { updateUserProfile, fetchUserProfile } from '../../../redux/slices/userSlice';
import { updateUserProfile as updateUserProfileAction } from '../../../redux/slices/authSlice';

const NAVY_BLUE = '#1a365d';
const LIGHT_BLUE = '#2563eb';
const ACCENT_BLUE = '#60a5fa';

const StyledCard = styled(Card)`
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
`;

const FormSection = styled.div`
    padding: 2rem;
    background: white;
    border-radius: 15px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    h5 {
        color: ${NAVY_BLUE};
        margin-bottom: 1.5rem;
        font-weight: 600;
        position: relative;
        padding-bottom: 0.5rem;

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, ${LIGHT_BLUE}, ${ACCENT_BLUE});
            border-radius: 3px;
        }
    }
`;

const StyledFormGroup = styled(Form.Group)`
    margin-bottom: 1.5rem;

    label {
        font-weight: 500;
        color: ${NAVY_BLUE};
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;

        &:after {
            content: ${props => props.required ? '"*"' : '""'};
            color: #dc2626;
        }
    }

    input, select {
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        padding: 0.75rem;
        transition: all 0.3s ease;
        font-size: 0.95rem;

        &:focus {
            border-color: ${LIGHT_BLUE};
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        &:disabled {
            background: #f8fafc;
            cursor: not-allowed;
            opacity: 0.7;
        }
    }

    .invalid-feedback {
        font-size: 0.85rem;
        margin-top: 0.5rem;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
`;

const StyledButton = styled(Button)`
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.9rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:disabled {
        opacity: 0.7;
        transform: none;
    }

    &.btn-light {
        background: #f8fafc;
        border-color: #e2e8f0;
        color: ${NAVY_BLUE};

        &:hover {
            background: #f1f5f9;
        }
    }

    &.btn-primary {
        background: ${LIGHT_BLUE};
        border-color: ${LIGHT_BLUE};

        &:hover {
            background: ${NAVY_BLUE};
            border-color: ${NAVY_BLUE};
        }
    }
`;

const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 500;
    background: ${props => props.$status ? '#dcfce7' : '#fee2e2'};
    color: ${props => props.$status ? '#166534' : '#991b1b'};
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitTimeoutRef = useRef(null);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        dni: user?.dni || '',
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

    // Validación optimizada usando useCallback
    const validateForm = useCallback(() => {
        const newErrors = {};
        const dniValue = formData.dni.toString().trim();

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'El username debe tener al menos 3 caracteres';
        }

        if (!dniValue || !/^\d{8}$/.test(dniValue)) {
            newErrors.dni = 'El DNI debe tener exactamente 8 dígitos numéricos';
        }

        if (!formData.first_name) newErrors.first_name = 'El nombre es requerido';
        if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
            newErrors.telefono = 'Teléfono debe tener 9 dígitos';
        }

        if (formData.edad && (formData.edad < 18 || formData.edad > 100)) {
            newErrors.edad = 'La edad debe estar entre 18 y 100 años';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Manejador de cambios optimizado
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Manejador de envío optimizado
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!validateForm()) {
            dispatch(showAlert({
                type: 'error',
                message: 'Por favor, corrija los errores en el formulario'
            }));
            return;
        }

        setIsSubmitting(true);
        submitTimeoutRef.current = setTimeout(async () => {

            try {
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
                    dni: formData.dni.toString(),
                    estudiante_data: user.estudiante_data
                };

                const resultAction = await dispatch(updateUserProfile(formattedData));

                if (resultAction.payload) {
                    dispatch(updateUserProfileAction(resultAction.payload));
                    dispatch(showAlert({
                        type: 'success',
                        message: 'Perfil actualizado exitosamente'
                    }));
                    onCancel();
                }
            } catch (error) {
                dispatch(showAlert({
                    type: 'error',
                    message: error.message || 'Error al actualizar el perfil'
                }));
            } finally {
                setIsSubmitting(false);
            }
        }, 500);
    };
    // Limpiar timeout al desmontar el componente
    useEffect(() => {
        return () => {
            if (submitTimeoutRef.current) {
                clearTimeout(submitTimeoutRef.current);
            }
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <StyledCard>
                <CardHeader>
                    <h4 className="mb-0 fw-bold">Editar Perfil</h4>
                </CardHeader>
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <FormSection>
                            <h5>Información Personal</h5>
                            <StyledFormGroup required>
                                <Form.Label>Username</Form.Label>
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
                            </StyledFormGroup>
                            <StyledFormGroup required>
                                <Form.Label>DNI</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    isInvalid={!!errors.dni}
                                    maxLength={8}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dni}
                                </Form.Control.Feedback>
                            </StyledFormGroup>

                            <div className="row">
                                <div className="col-md-6">
                                    <StyledFormGroup required>
                                        <Form.Label>Nombre</Form.Label>
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
                                    </StyledFormGroup>
                                </div>
                                <div className="col-md-6">
                                    <StyledFormGroup required>
                                        <Form.Label>Apellido</Form.Label>
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
                                    </StyledFormGroup>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection>
                            <h5>Información de Contacto</h5>
                            <StyledFormGroup required>
                                <Form.Label>Email</Form.Label>
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
                            </StyledFormGroup>

                            <div className="row">
                                <div className="col-md-6">
                                    <StyledFormGroup>
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
                                    </StyledFormGroup>
                                </div>
                                <div className="col-md-6">
                                    <StyledFormGroup>
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
                                    </StyledFormGroup>
                                </div>
                            </div>

                            <StyledFormGroup>
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
                            </StyledFormGroup>
                        </FormSection>

                        <FormSection>
                            <h5>Información Institucional</h5>
                            <StyledFormGroup>
                                <Form.Label>Rol</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="rol"
                                    value={roleLabels[formData.rol] || formData.rol}
                                    disabled
                                />
                            </StyledFormGroup>

                            {formData.rol === 'ESTUDIANTE' && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <StyledFormGroup>
                                            <Form.Label>Carrera</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="carrera"
                                                value={formData.carrera}
                                                disabled
                                            />
                                        </StyledFormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <StyledFormGroup>
                                            <Form.Label>Ciclo</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ciclo"
                                                value={formData.ciclo}
                                                disabled
                                            />
                                        </StyledFormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <StyledFormGroup>
                                            <Form.Label>Boleta de Pago</Form.Label>
                                            <div className="mt-2">
                                                <StatusBadge $status={formData.boleta_pago}>
                                                    {formData.boleta_pago ? 'Cargada' : 'Pendiente'}
                                                </StatusBadge>
                                            </div>
                                        </StyledFormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <StyledFormGroup>
                                            <Form.Label>FUT</Form.Label>
                                            <div className="mt-2">
                                                <StatusBadge $status={formData.fut}>
                                                    {formData.fut ? 'Cargado' : 'Pendiente'}
                                                </StatusBadge>
                                            </div>
                                        </StyledFormGroup>
                                    </div>
                                </div>
                            )}
                        </FormSection>

                        <ButtonContainer>
                            <StyledButton
                                variant="light"
                                onClick={onCancel}
                                disabled={updateStatus === 'loading'}
                            >
                                Cancelar
                            </StyledButton>
                            <StyledButton
                                variant="primary"
                                type="submit"
                                disabled={updateStatus === 'loading'}
                            >
                                {updateStatus === 'loading' ? 'Guardando...' : 'Guardar Cambios'}
                            </StyledButton>
                        </ButtonContainer>
                    </Form>
                </Card.Body>
            </StyledCard>
        </motion.div>
    );
};

export default EditProfile;
