import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createModulo } from "../../redux/slices/moduloSlice";
import { showAlert } from '../../redux/slices/alertSlice';

const CrearModulo = ({ onClose }) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createModulo(formData)).unwrap();
            dispatch(showAlert({
                type: 'success',
                message: 'Módulo creado exitosamente'
            }));
            onClose();
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: 'Error al crear el módulo'
            }));
        }
    };

    return (
        <Card className="shadow">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Crear Nuevo Módulo</h4>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Módulo</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Módulo</Form.Label>
                        <Form.Select
                            value={formData.tipo_modulo}
                            onChange={(e) => setFormData({ ...formData, tipo_modulo: e.target.value })}
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
                            rows={3}
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Horas Requeridas</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.horas_requeridas}
                            onChange={(e) => setFormData({ ...formData, horas_requeridas: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.fecha_inicio}
                            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Fin</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.fecha_fin}
                            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estructura del Informe</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setFormData({ ...formData, estructura_informe: e.target.files[0] })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Activo"
                            checked={formData.activo}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Crear Módulo
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CrearModulo;
