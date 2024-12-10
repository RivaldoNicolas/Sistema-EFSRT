import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInformes, updateInforme } from '../../redux/slices/informeSlice';
import { showAlert } from '../../redux/slices/alertSlice';
import styled from 'styled-components';

const StyledTable = styled(Table)`
  th, td {
    vertical-align: middle;
  }
`;

const DocumentLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const EvaluarInformes = () => {
  const dispatch = useDispatch();
  const informes = useSelector(state => state.informes.informes || []);
  const status = useSelector(state => state.informes.status);
  const [showModal, setShowModal] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState(null);
  const [calificacion, setCalificacion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchInformes());
  }, [dispatch]);

  const handleEvaluar = async () => {
    if (!calificacion || calificacion < 0 || calificacion > 20) {
      dispatch(showAlert({
        type: 'error',
        message: 'La calificación debe estar entre 0 y 20'
      }));
      return;
    }

    try {
      await dispatch(updateInforme({
        id: selectedInforme.id,
        informeData: {
          calificacion: parseFloat(calificacion),
          observaciones,
          evaluado_por: true
        }
      })).unwrap();

      dispatch(showAlert({
        type: 'success',
        message: 'Informe evaluado exitosamente'
      }));

      setShowModal(false);
      setCalificacion('');
      setObservaciones('');
      dispatch(fetchInformes());
    } catch (error) {
      dispatch(showAlert({
        type: 'error',
        message: error.message || 'Error al evaluar el informe'
      }));
    }
  };

  const filteredInformes = informes.filter(informe =>
    informe.estudiante_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    informe.modulo_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Evaluación de Informes</h4>
          <Form.Control
            type="text"
            placeholder="Buscar por estudiante o módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-auto"
          />
        </Card.Header>
        <Card.Body>
          <StyledTable responsive>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Módulo</th>
                <th>Documento</th>
                <th>Fecha Entrega</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInformes.map(informe => (
                <tr key={informe.id}>
                  <td>{informe.estudiante_nombre}</td>
                  <td>
                    {informe.modulo_nombre}
                    <br />
                    <small className="text-muted">{informe.modulo_tipo}</small>
                  </td>
                  <td>
                    {informe.documento_url && (
                      <DocumentLink
                        href={informe.documento_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Documento
                      </DocumentLink>
                    )}
                  </td>
                  <td>{new Date(informe.fecha_entrega).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={informe.calificacion ? 'success' : 'warning'}>
                      {informe.calificacion ? 'Evaluado' : 'Pendiente'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedInforme(informe);
                        setCalificacion(informe.calificacion?.toString() || '');
                        setObservaciones(informe.observaciones || '');
                        setShowModal(true);
                      }}
                      disabled={informe.calificacion !== null}
                    >
                      {informe.calificacion ? 'Ver Evaluación' : 'Evaluar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedInforme?.calificacion ? 'Ver Evaluación' : 'Evaluar Informe'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Calificación (0-20)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={calificacion}
                onChange={(e) => setCalificacion(e.target.value)}
                disabled={selectedInforme?.calificacion}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                disabled={selectedInforme?.calificacion}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          {!selectedInforme?.calificacion && (
            <Button
              variant="primary"
              onClick={handleEvaluar}
              disabled={!calificacion}
            >
              Guardar Evaluación
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EvaluarInformes;
