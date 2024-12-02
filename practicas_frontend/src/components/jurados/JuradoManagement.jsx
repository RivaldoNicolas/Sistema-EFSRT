import React, { useState } from 'react';
import ListarJuradosAsignados from '../jurados/ListarJuradosAsignados';
import AsignarJurado from '../jurados/AsignarJurado';
import { Button, ButtonGroup } from 'react-bootstrap';

const JuradoManagement = () => {
    const [activeComponent, setActiveComponent] = useState('crear');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'listar':
                return <ListarJuradosAsignados />;
            case 'crear':
                return <AsignarJurado />;
            default:
                return <AsignarJurado />;
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
                    Listar Jurados Asignados A un Modulo
                </Button>
                <Button
                    variant={activeComponent === 'crear' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveComponent('crear')}
                >
                    Asignar Jurado a un Modulo
                </Button>
            </ButtonGroup>
            {renderComponent()}
        </div>
    );
};

export default JuradoManagement;