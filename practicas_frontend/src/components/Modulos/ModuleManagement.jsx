import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import CrearModulo from './CrearModulo';
import ListarModulos from './ListarModulos';
import AsignarJurado from './AsignarJurado';
import AsignarDocente from './AsignarDocente';
import AsignacionesModulo from './AsignacionesModulo';

const ModuleManagement = () => {
    const [currentView, setCurrentView] = useState('list');
    const [selectedModulo, setSelectedModulo] = useState(null);

    const renderView = () => {
        switch (currentView) {
            case 'create':
                return <CrearModulo onClose={() => setCurrentView('list')} />;
            case 'asignaciones':
                return (
                    <AsignacionesModulo
                        moduloData={selectedModulo}
                        onBack={() => setCurrentView('list')}
                        onAsignarJurado={() => setCurrentView('asignarJurado')}
                        onAsignarDocente={() => setCurrentView('asignarDocente')}
                    />
                );
            case 'asignarJurado':
                return (
                    <AsignarJurado
                        moduloId={selectedModulo.id}
                        onClose={() => setCurrentView('asignaciones')}
                    />
                );
            case 'asignarDocente':
                return (
                    <AsignarDocente
                        moduloId={selectedModulo.id}
                        onClose={() => setCurrentView('asignaciones')}
                    />
                );
            default:
                return (
                    <ListarModulos
                        onModuleSelect={(modulo) => {
                            setSelectedModulo(modulo);
                            setCurrentView('asignaciones');
                        }}
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
