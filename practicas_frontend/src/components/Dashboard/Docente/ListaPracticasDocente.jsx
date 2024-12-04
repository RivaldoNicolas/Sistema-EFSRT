import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { fetchPracticasDocente } from '../../../redux/slices/docenteSlice';
import { FaSearch } from 'react-icons/fa';

const ListaPracticasDocente = ({ setCurrentComponent, setSelectedPracticaId }) => {
    const dispatch = useDispatch();
    const { practicas, loading, error } = useSelector((state) => state.docente);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState('');

    // Get unique modules from practicas
    const uniqueModules = [...new Set(practicas.map(practica => practica.modulo.nombre))];

    const handleAsistenciaClick = (practicaId) => {
        setSelectedPracticaId(practicaId);
        setCurrentComponent('diarionota');
    };

    const refreshList = () => {
        dispatch(fetchPracticasDocente());
    };

    useEffect(() => {
        refreshList();
    }, [dispatch]);

    const filteredPracticas = practicas.filter(practica => {
        const fullName = `${practica.estudiante.first_name} ${practica.estudiante.last_name}`.toLowerCase();
        const nameMatch = fullName.includes(searchTerm.toLowerCase());
        const moduleMatch = selectedModule ? practica.modulo.nombre === selectedModule : true;
        return nameMatch && moduleMatch;
    });

    if (loading) return <div>Cargando prácticas...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Row className="mb-3">
                <Col md={4}>
                    <Button
                        onClick={refreshList}
                        variant="outline-primary"
                        className="mb-3"
                    >
                        Actualizar Lista
                    </Button>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar por nombre de estudiante..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                    >
                        <option value="">Todos los módulos</option>
                        {uniqueModules.map((module, index) => (
                            <option key={index} value={module}>
                                {module}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Módulo</th>
                        <th>Estado</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Nota</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPracticas.map((practica) => (
                        <tr key={practica.id}>
                            <td>{`${practica.estudiante.first_name} ${practica.estudiante.last_name}`}</td>
                            <td>{practica.modulo.nombre}</td>
                            <td>
                                <Badge bg={practica.estado === 'EN_CURSO' ? 'primary' : 'success'}>
                                    {practica.estado}
                                </Badge>
                            </td>
                            <td>{practica.fecha_inicio}</td>
                            <td>{practica.fecha_fin}</td>
                            <td>{practica.nota_final || 'Pendiente'}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleAsistenciaClick(practica.id)}
                                >
                                    Asistencia
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ListaPracticasDocente;
