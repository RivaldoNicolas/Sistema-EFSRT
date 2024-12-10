import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Spinner, Button, Alert } from 'react-bootstrap';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { subirBoletaThunk, selectBoletaStatus, selectBoletaUrl } from '../../../redux/slices/estudiantesSlice';

const SubirBoleta = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadError, setUploadError] = useState({});

    useEffect(() => {
        dispatch(fetchUsersByRole('ESTUDIANTE'));
    }, [dispatch]);

    const filteredUsers = users.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create a map of user IDs to their upload status and boleta URL
    const uploadStatuses = useSelector(state =>
        filteredUsers.reduce((acc, user) => {
            acc[user.id] = selectBoletaStatus(state, user.id);
            return acc;
        }, {})
    );

    const boletaUrls = useSelector(state =>
        filteredUsers.reduce((acc, user) => {
            acc[user.id] = selectBoletaUrl(state, user.id);
            return acc;
        }, {})
    );

    const handleFileUpload = async (estudianteId, file) => {
        try {
            setUploadError(prev => ({ ...prev, [estudianteId]: null }));
            await dispatch(subirBoletaThunk({ estudianteId, file })).unwrap();
        } catch (error) {
            setUploadError(prev => ({
                ...prev,
                [estudianteId]: 'Error al subir la boleta'
            }));
            console.error('Error:', error);
        }
    };

    const handleViewFile = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        } else {
            alert('No hay boleta disponible');
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Subir Boletas - Estudiantes</h3>
                <Form.Group className="mb-2">
                    <Form.Control
                        style={{ width: '300px' }}
                        type="text"
                        placeholder="Buscar por nombre o apellido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Apellidos</th>
                            <th>Nombres</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => {
                            const uploadStatus = uploadStatuses[user.id];
                            const boletaUrl = boletaUrls[user.id];

                            return (
                                <tr key={user.id}>
                                    <td>{user.last_name}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td className="d-flex flex-column align-items-center">
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="mb-2"
                                            onClick={() =>
                                                document.getElementById(`fileInput-${user.id}`).click()
                                            }
                                            disabled={uploadStatus === "loading"}
                                        >
                                            {uploadStatus === "loading" ?
                                                "Subiendo..." : "Subir Boleta"}
                                        </Button>

                                        <input
                                            type="file"
                                            id={`fileInput-${user.id}`}
                                            style={{ display: 'none' }}
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) =>
                                                handleFileUpload(user.id, e.target.files[0])
                                            }
                                        />

                                        {uploadError[user.id] && (
                                            <Alert variant="danger" className="p-1 mb-2">
                                                {uploadError[user.id]}
                                            </Alert>
                                        )}

                                        {boletaUrl && (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleViewFile(boletaUrl)}
                                            >
                                                Ver Boleta
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
};
export default SubirBoleta;
