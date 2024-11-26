import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const VerModulo = ({ show, onHide }) => {
    const selectedModulo = useSelector(state => state.modulos.selectedModulo);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES');
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Detalles del Módulo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedModulo && (
                    <div className="p-3">
                        <Row className="mb-3">
                            <Col md={6}>
                                <h5 className="text-primary mb-4">Información General</h5>
                                <p><strong>Nombre:</strong> {selectedModulo.nombre}</p>
                                <p><strong>Tipo de Módulo:</strong> {selectedModulo.tipo_modulo}</p>
                                <p><strong>Estado:</strong>
                                    <Badge bg={selectedModulo.activo ? 'success' : 'danger'} className="ms-2">
                                        {selectedModulo.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </p>
                            </Col>
                            <Col md={6}>
                                <h5 className="text-primary mb-4">Fechas y Duración</h5>
                                <p><strong>Fecha Inicio:</strong> {formatDate(selectedModulo.fecha_inicio)}</p>
                                <p><strong>Fecha Fin:</strong> {formatDate(selectedModulo.fecha_fin)}</p>
                                <p><strong>Horas Requeridas:</strong> {selectedModulo.horas_requeridas} horas</p>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <h5 className="text-primary mb-3">Descripción</h5>
                            <p className="text-justify">{selectedModulo.descripcion}</p>
                        </div>

                        {selectedModulo.estructura_informe && (
                            <div className="mb-4">
                                <h5 className="text-primary mb-3">Documentación</h5>
                                <p>
                                    <strong>Estructura del Informe: </strong>
                                    <a
                                        href={selectedModulo.estructura_informe}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm ms-2"
                                    >
                                        Ver Documento
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VerModulo;
