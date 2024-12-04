import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvaluaciones, deleteEvaluacion } from '../../redux/slices/juradosSlice';

const EvaluacionList = () => {
    const dispatch = useDispatch();
    const evaluaciones = useSelector(state => state.jurado.evaluaciones);
    const status = useSelector(state => state.jurado.status);

    useEffect(() => {
        dispatch(fetchEvaluaciones());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteEvaluacion(id));
    };

    if (status === 'loading') return <div>Cargando...</div>;

    return (
        <div className="container mt-4">
            <h2>Evaluaciones Realizadas</h2>
            <div className="row">
                {evaluaciones.map(evaluacion => (
                    <div key={evaluacion.id} className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Evaluación #{evaluacion.id}</h5>
                                <p>Calificación: {evaluacion.calificacion}</p>
                                <p>Observaciones: {evaluacion.observaciones}</p>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(evaluacion.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvaluacionList;