import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInforme } from '../../../redux/slices/informeSlice';
import { fetchPracticas } from '../../../redux/slices/practicasSlice';
import { createSelector } from '@reduxjs/toolkit';
import { showAlert } from '../../../redux/slices/alertSlice';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

// Selectores base
const selectPracticasBase = state => state.practicas.items;
const selectUserId = state => state.auth.user?.id;

// Selector memorizado
const makeSelectPracticasEstudiante = () => createSelector(
    [selectPracticasBase, selectUserId],
    (practicas, userId) => practicas.filter(practica =>
        practica?.estudiante?.id === userId &&
        ['PENDIENTE', 'EN_CURSO'].includes(practica.estado)
    )
);

const CrearInforme = () => {
    const dispatch = useDispatch();
    const selectPracticasEstudiante = useMemo(makeSelectPracticasEstudiante, []);
    const practicas = useSelector(selectPracticasEstudiante);
    const status = useSelector(state => state.informes.status);

    const [formData, setFormData] = useState({
        practica: '',
        contenido: '',
        documento: null
    });
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(fetchPracticas());
    }, [dispatch]);

    useEffect(() => {
        if (practicas.length === 1) {
            setFormData(prev => ({
                ...prev,
                practica: practicas[0].id
            }));
        }
    }, [practicas]);

    const validateFormData = () => {
        if (!formData.practica) return 'Debe seleccionar una práctica';
        if (!formData.contenido.trim()) return 'El contenido es requerido';
        if (!formData.documento) return 'Debe adjuntar un documento';
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Solo se permiten archivos PDF');
                return;
            }
            if (file.size > 5242880) { // 5MB
                setError('El archivo no debe superar los 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                documento: file
            }));

            const url = URL.createObjectURL(file);
            setPreview(url);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('practica', formData.practica);
            formDataToSend.append('contenido', formData.contenido);
            if (formData.documento) {
                formDataToSend.append('documento', formData.documento);
            }

            console.log('Enviando datos:', {
                practica: formData.practica,
                contenido: formData.contenido,
                documento: formData.documento?.name
            });

            const result = await dispatch(createInforme(formDataToSend)).unwrap();

            dispatch(showAlert({
                type: 'success',
                message: 'Informe creado exitosamente'
            }));

            setFormData({
                practica: '',
                contenido: '',
                documento: null
            });
            setPreview('');

        } catch (err) {
            console.error('Error al crear informe:', err);
            setError(err.message || 'Error al crear el informe');
            dispatch(showAlert({
                type: 'error',
                message: 'Error al crear el informe'
            }));
        } finally {
            setLoading(false);
        }
    };

    if (practicas.length === 0) {
        return (
            <Alert variant="info">
                No tienes prácticas activas disponibles para subir informes
            </Alert>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
        >
            <StyledCard>
                <Card.Header as="h5">Crear Nuevo Informe</Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Módulo de Práctica</Form.Label>
                            <Form.Select
                                name="practica"
                                value={formData.practica}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione el módulo</option>
                                {practicas.map(practica => (
                                    <option key={practica.id} value={practica.id}>
                                        {practica.modulo.nombre} - Módulo {practica.modulo.tipo_modulo}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contenido del Informe</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="contenido"
                                value={formData.contenido}
                                onChange={handleInputChange}
                                placeholder="Describe el contenido de tu informe"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Documento PDF (Máx. 5MB)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                Solo se aceptan archivos PDF de hasta 5MB
                            </Form.Text>
                            {preview && (
                                <div className="mt-2">
                                    <embed
                                        src={preview}
                                        type="application/pdf"
                                        width="100%"
                                        height="300px"
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || status === 'loading'}
                        >
                            {loading ? 'Creando...' : 'Crear Informe'}
                        </Button>
                    </Form>
                </Card.Body>
            </StyledCard>
        </motion.div>
    );
};

export default CrearInforme;
