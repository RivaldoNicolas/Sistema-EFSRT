import React from "react";
import { Table, Form, Button } from "react-bootstrap";

const EvaluacionE = () => {
    const users = [
        {
            username: "",
            email: "",
            rol: "",
        },
    ];

    const handleView = (username) => {
        alert(`Ver detalles del usuario: ${username}`);
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-4">Evaluacion de Jurados</h3>


            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
                            <td>{user.estado}</td>
                            <td className="d-flex justify-content-center">
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleView(user.username)}
                                >
                                    Ver
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default EvaluacionE;