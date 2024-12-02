// ListarJuradosAsignados.jsx
import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModulos, listarJuradosAsignados } from '../../redux/slices/moduloSlice';


const ListarJuradosAsignados = () => {
    const dispatch = useDispatch();
    const [selectedModulo, setSelectedModulo] = useState('');
    const { modulos, juradosAsignados, loading, error } = useSelector((state) => state.modulos);

    useEffect(() => {
        dispatch(fetchModulos());
    }, [dispatch]);

    useEffect(() => {
        if (selectedModulo) {
            dispatch(listarJuradosAsignados(selectedModulo));
        }
    }, [selectedModulo, dispatch]);

    // Asegúrate de que juradosAsignados sea un arreglo
    const jurados = Array.isArray(juradosAsignados) ? juradosAsignados : [];

    return (
        <div className="mt-4">
            <h4 className="mb-4">Jurados Asignados al Módulo</h4>
            <Form.Group controlId="moduloSelect">
                <Form.Label>Seleccione un Módulo</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedModulo}
                    onChange={(e) => setSelectedModulo(e.target.value)}
                >
                    <option value="">Seleccione...</option>
                    {modulos.map((modulo) => (
                        <option key={modulo.id} value={modulo.id}>
                            {modulo.nombre}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            {loading ? (
                <div className="text-center p-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            ) : (
                <div>
                    {jurados.length === 0 ? (
                        <Alert variant="info" className="mt-3">
                            No hay jurados asignados a este módulo.
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID del Jurado</th>
                                    <th>Nombre de Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jurados.map((jurado, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{jurado.jurado__id}</td>
                                        <td>{jurado.jurado__username}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListarJuradosAsignados;