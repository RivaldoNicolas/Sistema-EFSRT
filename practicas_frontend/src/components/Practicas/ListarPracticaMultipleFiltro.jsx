import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Spinner } from 'react-bootstrap';
import { fetchPracticasWithFilters, fetchModuleTypes } from '../../redux/slices/practicasSlice';

const ListarPracticaMultiplesFiltros = () => {
    const dispatch = useDispatch();
    const { practicas, loading } = useSelector(state => state.practicas || { practicas: [], loading: false });
    const moduleTypes = useSelector((state) => state.practicas.moduleTypes);

    const [filters, setFilters] = useState({
        nombre: '',
        fecha: '',
        modulo__tipo_modulo: '',
        estado: '',
        fecha_inicio_gte: '',
    });


    useEffect(() => {
        dispatch(fetchPracticasWithFilters(filters));
        dispatch(fetchModuleTypes());
    }, [dispatch, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({

            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="listar-practica">
            <h3>Listar Prácticas</h3>
            <Form>
                <Form.Group controlId="filterNombre">
                    <Form.Label>Filtrar por Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={filters.nombre}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterFecha">
                    <Form.Label>Filtrar por Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        name="fecha"
                        value={filters.fecha}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterModuloTipo">
                    <Form.Label>Filtrar por Tipo de Módulo</Form.Label>
                    {loading ? (
                        <Spinner animation="border" />
                    ) : (
                        <Form.Control
                            as="select"
                            name="modulo__tipo_modulo"
                            value={filters.modulo__tipo_modulo}
                            onChange={handleFilterChange}
                        >
                            <option value="">Seleccione un tipo de módulo</option>
                            {moduleTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    )}
                </Form.Group>
                <Form.Group controlId="filterEstado">
                    <Form.Label>Filtrar por Estado</Form.Label>
                    <Form.Control
                        type="text"
                        name="estado"
                        value={filters.estado}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterFechaInicio">
                    <Form.Label>Filtrar por Fecha de Inicio</Form.Label>
                    <Form.Control
                        type="date"
                        name="fecha_inicio_gte"
                        value={filters.fecha_inicio_gte}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
            </Form>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(practicas) && practicas.map(practica => (
                            <tr key={practica.id}>
                                <td>{practica.nombre}</td>
                                <td>{practica.descripcion}</td>
                                <td>{practica.fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ListarPracticaMultiplesFiltros;