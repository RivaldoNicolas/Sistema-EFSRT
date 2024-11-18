import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 bg-dark text-light p-4">
                    <h3>Panel Administrativo</h3>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a href="#" className="nav-link text-light">Gestión de Usuarios</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link text-light">Configuración</a>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="col-md-9 p-4">
                    <h2>Bienvenido, Administrador</h2>
                    <div className="row mt-4">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5>Usuarios Activos</h5>
                                    <p className="h2">150</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
