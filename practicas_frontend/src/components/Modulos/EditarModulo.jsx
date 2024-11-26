import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateModulo } from '../../redux/slices/moduloSlice';
import { showAlert } from '../../redux/slices/alertSlice';

const EditarModulo = ({ modulo, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo_modulo: 'MODULO1',
        horas_requeridas: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: true,
        estructura_informe: null
    });

    useEffect(() => {
        if (modulo) {
            setFormData({
                nombre: modulo.nombre || '',
                descripcion: modulo.descripcion || '',
                tipo_modulo: modulo.tipo_modulo || 'MODULO1',
                horas_requeridas: modulo.horas_requeridas || '',
                fecha_inicio: modulo.fecha_inicio || '',
                fecha_fin: modulo.fecha_fin || '',
                activo: modulo.activo ?? true,
                estructura_informe: modulo.estructura_informe || null
            });
        }
    }, [modulo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Convertimos el booleano a string para el backend
        const activoValue = formData.activo.toString();

        // Agregamos cada campo al FormData
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('tipo_modulo', formData.tipo_modulo);
        formDataToSend.append('horas_requeridas', formData.horas_requeridas);
        formDataToSend.append('fecha_inicio', formData.fecha_inicio);
        formDataToSend.append('fecha_fin', formData.fecha_fin);
        formDataToSend.append('activo', activoValue);

        if (formData.estructura_informe instanceof File) {
            formDataToSend.append('estructura_informe', formData.estructura_informe);
        }

        try {
            await dispatch(updateModulo({
                id: modulo.id,
                moduloData: formDataToSend
            })).unwrap();

            dispatch(showAlert({
                type: 'success',
                message: 'Módulo actualizado exitosamente'
            }));
            onClose();
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: 'Error al actualizar el módulo'
            }));
        }
    };



    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'file' ? files[0] :
                    value
        }));
    };

    return (
        <Card className="shadow">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Editar Módulo</h4>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Módulo</Form.Label>
                        <Form.Select
                            name="tipo_modulo"
                            value={formData.tipo_modulo}
                            onChange={handleChange}
                        >
                            <option value="MODULO1">Módulo I</option>
                            <option value="MODULO2">Módulo II</option>
                            <option value="MODULO3">Módulo III</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Horas Requeridas</Form.Label>
                        <Form.Control
                            type="number"
                            name="horas_requeridas"
                            value={formData.horas_requeridas}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_inicio"
                            value={formData.fecha_inicio}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_fin"
                            value={formData.fecha_fin}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estructura del Informe</Form.Label>
                        <Form.Control
                            type="file"
                            name="estructura_informe"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Activo"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar Cambios
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditarModulo;
