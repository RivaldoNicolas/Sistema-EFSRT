import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../../redux/slices/userSlice';
import { Table, Form, Spinner, Button } from 'react-bootstrap';

const SubirBoleta = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.users);
    const [selectedRole, setSelectedRole] = useState('ESTUDIANTE');
    const [searchTerm, setSearchTerm] = useState('');
    const [fileUploads, setFileUploads] = useState({}); // Estado para almacenar información de archivos subidos

    const filteredUsers = users.filter(user =>
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        dispatch(fetchUsersByRole(selectedRole));
    }, [dispatch, selectedRole]);

    // Función para manejar la carga de archivos
    const handleFileUpload = async (userId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);

            // Enviar al servidor
            const response = await axios.post('/api/upload-document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Actualizar el estado con la URL del archivo subido
            setFileUploads(prevState => ({
                ...prevState,
                [userId]: response.data.file_url, // URL del archivo desde el servidor
            }));

            console.log('Archivo subido exitosamente:', response.data);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    };

    // Función para abrir el archivo en una nueva pestaña
    const handleViewFile = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank'); // Abre el archivo en una nueva pestaña
        } else {
            alert('No hay archivo disponible para visualizar.');
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Lista de Estudiantes</h3>

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
                            <th>Nombre de usuario</th>
                            <th>Email</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.apellidos || user.last_name}</td>
                                <td>{user.nombres || user.first_name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td className="d-flex flex-column align-items-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="mb-2"
                                        onClick={() => document.getElementById(`fileInput - ${user.id}`).click()}
                                    >
                                        Subir Boleta
                                    </Button>
                                    <Form.Control
                                        type="file"
                                        id={`fileInput - ${user.id}`}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(user.id, e.target.files[0])}
                                    />
                                    {fileUploads[user.id] && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleViewFile(fileUploads[user.id])}
                                        >
                                            Ver
                                        </Button>
                                    )}
                                    {!fileUploads[user.id] && (
                                        <small className="text-muted mt-2">No hay archivo subido</small>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default SubirBoleta;