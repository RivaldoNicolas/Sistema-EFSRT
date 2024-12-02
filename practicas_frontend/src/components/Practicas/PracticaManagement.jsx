import React, { useState } from 'react';
import CrearPractica from '../Practicas/CrearPractica';
import ListarPracticaMultiplesFiltros from '../Practicas/ListarPracticaMultipleFiltro';
import { Button, ButtonGroup } from 'react-bootstrap';

const PracticaManagement = () => {
    const [activeComponent, setActiveComponent] = useState('listar');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'crear':
                return <CrearPractica />;
            case 'listar':
                return <ListarPracticaMultiplesFiltros />;
            default:
                return <ListarPracticaMultiplesFiltros />;
        }
    };

    return (
        <div className="practica-management">
            <h2>Gestión de Prácticas</h2>
            <ButtonGroup className="mb-3">
                <Button
                    variant={activeComponent === 'listar' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveComponent('listar')}
                >
                    Listar Prácticas
                </Button>
                <Button
                    variant={activeComponent === 'crear' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveComponent('crear')}
                >
                    Crear Práctica
                </Button>
            </ButtonGroup>
            {renderComponent()}
        </div>
    );
};

export default PracticaManagement;