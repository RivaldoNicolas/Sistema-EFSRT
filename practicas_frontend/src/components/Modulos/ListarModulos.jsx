import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchModulos, deleteModulo, fetchModuloDetails } from '../../redux/slices/moduloSlice';
import { showAlert } from '../../redux/slices/alertSlice';
import VerModulo from './VerModulo';
import EditarModulo from './EditarModulo';

const ListarModulos = ({ onModuleSelect }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { modulos, loading } = useSelector(state => state.modulos);
    const [showDetails, setShowDetails] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedModulo, setSelectedModulo] = useState(null);

    useEffect(() => {
        dispatch(fetchModulos());
    }, [dispatch]);

    const handleDelete = async (e, moduloId) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar este módulo?')) {
            try {
                await dispatch(deleteModulo(moduloId)).unwrap();
                dispatch(showAlert({
                    type: 'success',
                    message: 'Módulo eliminado exitosamente'
                }));
            } catch (error) {
                dispatch(showAlert({
                    type: 'error',
                    message: 'Error al eliminar el módulo'
                }));
            }
        }
    };

    const handleView = async (e, moduloId) => {
        e.stopPropagation();
        try {
            await dispatch(fetchModuloDetails(moduloId));
            setShowDetails(true);
        } catch (error) {
            dispatch(showAlert({
                type: 'error',
                message: 'Error al cargar los detalles del módulo'
            }));
        }
    };

    const handleEdit = (e, modulo) => {
        e.stopPropagation();
        setSelectedModulo(modulo);
        setShowEditForm(true);
    };

    const handleRowClick = (modulo) => {
        onModuleSelect(modulo);
        navigate(`/practicas/dashboard/modulos/${modulo.id}/asignaciones`);
    };

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded shadow">
            {showEditForm ? (
                <EditarModulo
                    modulo={selectedModulo}
                    onClose={() => setShowEditForm(false)}
                />
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo Módulo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(modulos) && modulos.map(modulo => (
                            <tr
                                key={modulo.id}
                                onClick={() => handleRowClick(modulo)}
                                style={{ cursor: 'pointer' }}
                                className="hover-row"
                            >
                                <td>{modulo.nombre}</td>
                                <td>{modulo.tipo_modulo}</td>
                                <td>
                                    <Badge bg={modulo.activo ? 'success' : 'danger'}>
                                        {modulo.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td onClick={e => e.stopPropagation()}>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={(e) => handleView(e, modulo.id)}
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={(e) => handleEdit(e, modulo)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => handleDelete(e, modulo.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <VerModulo
                show={showDetails}
                onHide={() => setShowDetails(false)}
            />
        </div>
    );
};

export default ListarModulos;
