import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
    return (
        <div className="d-flex flex-column bg-dark text-white min-vh-100 p-3" id="sidebar-wrapper">
            <Navbar.Brand className="mb-4 text-white">
                <h4>My Dashboard</h4>
            </Navbar.Brand>

            <Nav className="flex-column mb-auto">
                <Nav.Link className="text-white hover-effect p-3 mb-2 rounded">
                    <i className="bi bi-house-door me-2"></i>
                    Home
                </Nav.Link>

                <Nav.Link className="text-white hover-effect p-3 mb-2 rounded">
                    <i className="bi bi-person me-2"></i>
                    Profile
                </Nav.Link>

                <Nav.Link className="text-white hover-effect p-3 mb-2 rounded">
                    <i className="bi bi-graph-up me-2"></i>
                    Analytics
                </Nav.Link>

                <Nav.Link className="text-white hover-effect p-3 mb-2 rounded">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                </Nav.Link>
            </Nav>

            <div className="mt-auto">
                <Button variant="outline-light" className="w-100">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
