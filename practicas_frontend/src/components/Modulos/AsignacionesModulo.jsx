import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AsignacionesModulo = ({ moduloData, onBack, onAsignarJurado, onAsignarDocente }) => {
    return (
        <Container className="py-4">
            <h3 className="mb-4">Asignaciones para: {moduloData?.nombre}</h3>
            <Row>
                <Col md={6}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Asignar Jurado</Card.Title>
                            <Card.Text>
                                Gestione la asignación del jurado para este módulo
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={onAsignarJurado}
                            >
                                Ir a Asignar Jurado
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Asignar Docente</Card.Title>
                            <Card.Text>
                                Gestione la asignación del docente para este módulo
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={onAsignarDocente}
                            >
                                Ir a Asignar Docente
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Button variant="secondary" onClick={onBack}>
                Volver
            </Button>
        </Container>
    );
};

export default AsignacionesModulo;
