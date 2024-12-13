import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import CrearModulo from './CrearModulo';
import ListarModulos from './ListarModulos';

const ModuleManagement = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedModulo, setSelectedModulo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const renderView = () => {
        switch (currentView) {
            case 'create':
                return <CrearModulo onClose={() => setCurrentView('list')} />;
            case 'list':
            default:
                return (
                    <ListarModulos
                        algo salio mal
                    />
                );
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-primary">Gestión de Módulos</h2>
                </Col>
                <Col xs="auto">
                    {currentView === 'list' ? (
                        <Button
                            variant="primary"
                            onClick={() => setCurrentView('create')}
                        >
                            Crear Nuevo Módulo
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentView('list')}
                        >
                            Volver
                        </Button>
                    )}
                </Col>
            </Row>
            {renderView()}
        </div>
    );
};

export default ModuleManagement;
