import React from "react";
import { Table, Button } from "react-bootstrap";

const DocenteDiari = ({ setCurrentComponent }) => {
    const users = [
        {
            nombre: "",
            apellido: "",
            rol: "",
        },
    ];

    const handleRedirect = () => {
        setCurrentComponent('diariodnot');
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3>LISTADO DE ESTUDIANTES</h3>

            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Ver Evaluación</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td className="d-flex justify-content-center">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleRedirect}
                                >
                                    Evaluar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default DocenteDiari;