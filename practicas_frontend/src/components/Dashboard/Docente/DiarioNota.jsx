import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registrarAsistencia } from '../../../redux/slices/docenteSlice';
import { Table, Form, Button } from 'react-bootstrap';

const DiarioNota = ({ setCurrentComponent, practicaId }) => {
    const dispatch = useDispatch();
    const [fechaActual] = useState(new Date().toISOString().split('T')[0]);

    const [asistenciaData, setAsistenciaData] = useState({
        practica: practicaId,
        fecha: fechaActual,
        asistio: 'ASISTIO',
        puntualidad: 'PUNTUAL',
        criterios_asistencia: {
            CONCEPTUAL: 0,
            PROCEDIMENTAL: 0,
            ACTITUDINAL: 0
        },
        puntaje_diario: "0.00",
        puntaje_general: "0.00"
    });

    // Update puntajes when criterios change
    const handleCriterioChange = (tipo, valor) => {
        const numeroValor = parseInt(valor);
        if (numeroValor >= 0 && numeroValor <= 20) {
            setAsistenciaData(prev => {
                const newCriterios = {
                    ...prev.criterios_asistencia,
                    [tipo]: numeroValor
                };
                const promedio = (
                    (newCriterios.CONCEPTUAL +
                        newCriterios.PROCEDIMENTAL +
                        newCriterios.ACTITUDINAL) / 3
                ).toFixed(2);

                return {
                    ...prev,
                    criterios_asistencia: newCriterios,
                    puntaje_diario: promedio,
                    puntaje_general: promedio
                };
            });
        }
    };

    const calcularPromedio = () => {
        const { CONCEPTUAL, PROCEDIMENTAL, ACTITUDINAL } = asistenciaData.criterios_asistencia;
        return ((CONCEPTUAL + PROCEDIMENTAL + ACTITUDINAL) / 3).toFixed(2);
    };

    const handleVolver = () => {
        setCurrentComponent('diariod');
    };

    const handleGuardarAsistencia = async () => {
        try {
            // Asegurarse que practicaId es un número
            const dataToSend = {
                ...asistenciaData,
                practica: parseInt(practicaId),
                fecha: fechaActual,
                criterios_asistencia: {
                    CONCEPTUAL: parseInt(asistenciaData.criterios_asistencia.CONCEPTUAL),
                    PROCEDIMENTAL: parseInt(asistenciaData.criterios_asistencia.PROCEDIMENTAL),
                    ACTITUDINAL: parseInt(asistenciaData.criterios_asistencia.ACTITUDINAL)
                }
            };

            console.log('Datos a enviar:', dataToSend); // Para debugging
            const result = await dispatch(registrarAsistencia(dataToSend)).unwrap();
            alert('Asistencia registrada exitosamente');
            setCurrentComponent('diariod');
        } catch (error) {
            // Mostrar el error específico del backend
            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                Object.values(error.response?.data || {})[0]?.[0] ||
                'Error al registrar la asistencia';
            alert(errorMessage);
            console.error('Datos del error:', error.response?.data);
        }
    };



    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Registro de Asistencia</h3>
                <Button variant="secondary" onClick={handleVolver}>
                    Volver al listado
                </Button>
            </div>

            <div className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        value={fechaActual}
                        disabled
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Estado de Asistencia</Form.Label>
                    <Form.Select
                        value={asistenciaData.asistio}
                        onChange={(e) => setAsistenciaData(prev => ({ ...prev, asistio: e.target.value }))}
                    >
                        <option value="ASISTIO">Asistió</option>
                        <option value="FALTA">Falta</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Puntualidad</Form.Label>
                    <Form.Select
                        value={asistenciaData.puntualidad}
                        onChange={(e) => setAsistenciaData(prev => ({ ...prev, puntualidad: e.target.value }))}
                    >
                        <option value="PUNTUAL">Puntual</option>
                        <option value="TARDANZA">Tardanza</option>
                    </Form.Select>
                </Form.Group>
            </div>

            <div className="mb-4">
                <h5>Criterios de Evaluación</h5>
                <div className="d-flex gap-3 align-items-end">
                    <Form.Group>
                        <Form.Label>Conceptual</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            max="20"
                            value={asistenciaData.criterios_asistencia.CONCEPTUAL}
                            onChange={(e) => handleCriterioChange('CONCEPTUAL', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Procedimental</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            max="20"
                            value={asistenciaData.criterios_asistencia.PROCEDIMENTAL}
                            onChange={(e) => handleCriterioChange('PROCEDIMENTAL', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Actitudinal</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            max="20"
                            value={asistenciaData.criterios_asistencia.ACTITUDINAL}
                            onChange={(e) => handleCriterioChange('ACTITUDINAL', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Promedio</Form.Label>
                        <Form.Control
                            type="text"
                            value={calcularPromedio()}
                            disabled
                            style={{ backgroundColor: '#e9ecef' }}
                        />
                    </Form.Group>
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <Button
                    variant="primary"
                    onClick={handleGuardarAsistencia}
                    className="me-2"
                >
                    Guardar Registro
                </Button>
            </div>
        </div>
    );
};

export default DiarioNota;
