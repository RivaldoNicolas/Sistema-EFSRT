import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
    Table,
    Badge,
    Button,
    Form,
    InputGroup,
    Row,
    Col,
    Spinner,
    Alert
} from 'react-bootstrap';

import { fetchPracticasJurados } from '../../redux/slices/juradosSlice';
import { FaSearch } from 'react-icons/fa';

const ListaPracticasJurados = ({ setCurrentComponent, setSelectedPracticaId }) => {
    const dispatch = useDispatch();
    const { practicas, loading, error } = useSelector((state) => state.jurado);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState('');

    // Get unique modules from practicas
    const uniqueModules = [...new Set(practicas.map(practica => practica.modulo.nombre))];

    const handleAsistenciaClick = (practicaId) => {
        setSelectedPracticaId(practicaId);
        setCurrentComponent('EvaluacionForm');
    };

    const refreshList = () => {
        dispatch(fetchPracticasJurados());
    };

    useEffect(() => {
        console.log('Dispatching fetchPracticasJurados');
        refreshList();
        // Verificar el resultado
        console.log('Prácticas:', practicas);
    }, [dispatch]);
    const getStatusBadge = (status) => {
        const statusConfig = {
            'EN_CURSO': { bg: 'primary', text: 'En Curso' },
            'PENDIENTE': { bg: 'warning', text: 'Pendiente' },
            'COMPLETADO': { bg: 'success', text: 'Completado' },
            'EVALUADO': { bg: 'info', text: 'Evaluado' }
        };

        const config = statusConfig[status] || { bg: 'secondary', text: status };
        return <Badge bg={config.bg}>{config.text}</Badge>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };




    const filteredPracticas = practicas.filter(practica => {
        const studentName = `${practica.estudiante.first_name} ${practica.estudiante.last_name}`.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase().trim();
        const moduleMatch = selectedModule ? practica.modulo.nombre === selectedModule : true;

        return (!searchTermLower || studentName.includes(searchTermLower)) && moduleMatch;
    });

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando prácticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="m-3">
                <Alert.Heading>Error al cargar las prácticas</Alert.Heading>
                <p>{error}</p>
                <Button onClick={refreshList} variant="outline-danger">
                    Reintentar
                </Button>
            </Alert>
        );
    }

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
                            <td>{getStatusBadge(practica.estado)}</td>
                            <td>{formatDate(practica.fecha_inicio)}</td>
                            <td>{formatDate(practica.fecha_fin)}</td>
                            <td>
                                {practica.nota_final ?
                                    <Badge bg="success">{practica.nota_final}</Badge> :
                                    <Badge bg="warning">Pendiente</Badge>
                                }
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleAsistenciaClick(practica.id)}
                                    disabled={practica.estado === 'EVALUADO'}
                                >
                                    {practica.estado === 'EVALUADO' ? 'Evaluado' : 'Evaluar'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {filteredPracticas.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center p-4">
                                <p className="text-muted mb-0">
                                    No se encontraron prácticas que coincidan con los criterios de búsqueda
                                </p>
                            </td>
                        </tr>
                    )}

                </tbody>
            </Table>
        </div>
    );
};

export default ListaPracticasJurados;
