import React, { useState } from 'react';
import ListarJuradosAsignados from '../jurados/ListarJuradosAsignados';
import AsignarJurado from '../jurados/AsignarJurado';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';

const JuradoManagement = () => {
    const [activeTab, setActiveTab] = useState('asignar');

    const renderContent = () => {
        switch (activeTab) {
            case 'listar':
                return <ListarJuradosAsignados />;
            case 'asignar':
                return <AsignarJurado />;
            default:
                return <AsignarJurado />;
        }
    };

    return (
        <Container fluid className="px-4 py-3">
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <h3 className="text-primary mb-0">Panel de Control de Jurados</h3>
                </Card.Header>

                <Card.Body className="p-0">
                    <Row className="g-0">
                        <Col md={12}>
                            <Nav
                                variant="pills"
                                className="p-3 bg-light border-bottom"
                                onSelect={(selectedKey) => setActiveTab(selectedKey)}
                            >
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="asignar"
                                        active={activeTab === 'asignar'}
                                        className="d-flex align-items-center"
                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Asignar Nuevo Jurado
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="listar"
                                        active={activeTab === 'listar'}
                                        className="d-flex align-items-center"
                                    >
                                        <i className="fas fa-list-alt me-2"></i>
                                        Ver Jurados Asignados
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>

                        <Col md={12} className="p-4">
                            {renderContent()}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default JuradoManagement;
