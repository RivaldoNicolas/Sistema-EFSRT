import { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/Layout.css';

const navegacion = [
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Nosotros', ruta: '/nosotros' },
    { nombre: 'Servicios', ruta: '/servicios' },
    { nombre: 'Institución', ruta: '/institucion' },
];

export default function Layout() {
    const [menuMovilVisible, setMenuMovilVisible] = useState(false);

    return (
        <div className="bg-white">
            {/* Barra de Navegación */}
            <Navbar bg="white" expand="lg" fixed="top" className="px-4">
                <Container fluid>
                    {/* Logo */}
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtjWt8u8zfB-EVkIItTLQj4sAPiLsg3vmADg&s"
                            height="80"
                            alt="Logo IESTPPA"
                        />
                    </Navbar.Brand>

                    {/* Botón de menú móvil */}
                    <Navbar.Toggle
                        aria-controls="navbarScroll"
                        onClick={() => setMenuMovilVisible(true)}
                    />

                    {/* Menú principal */}
                    <Navbar.Collapse id="navbarScroll" className="justify-content-between">
                        <Nav className="mx-auto">
                            {navegacion.map((item) => (
                                <Nav.Link
                                    key={item.nombre}
                                    as={Link}
                                    to={item.ruta}
                                    className="fw-semibold text-dark mx-3"
                                >
                                    {item.nombre}
                                </Nav.Link>
                            ))}
                        </Nav>
                        <Nav>
                            <Nav.Link as={Link} to="/login" className="fw-semibold text-dark">
                                Iniciar Sesión →
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Menú Móvil */}
            <Offcanvas show={menuMovilVisible} onHide={() => setMenuMovilVisible(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtjWt8u8zfB-EVkIItTLQj4sAPiLsg3vmADg&s"
                            height="35"
                            alt="IESTPPA"
                        />
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        {navegacion.map((item) => (
                            <Nav.Link
                                key={item.nombre}
                                as={Link}
                                to={item.ruta}
                                className="fw-semibold text-dark py-2"
                                onClick={() => setMenuMovilVisible(false)}
                            >
                                {item.nombre}
                            </Nav.Link>
                        ))}
                        <Nav.Link
                            as={Link}
                            to="/login"
                            className="fw-semibold text-dark py-2"
                            onClick={() => setMenuMovilVisible(false)}
                        >
                            Iniciar Sesión
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Contenido Principal */}
            <Container className="px-4 text-center" style={{ marginTop: '120px' }}>
                <div className="mx-auto" style={{ maxWidth: '42rem' }}>
                    <h1 className="display-3 fw-semibold mb-4">
                        Sistema de Prácticas Pre-Profesionales
                    </h1>
                    <p className="lead text-secondary mb-5">
                        Gestiona tus prácticas pre-profesionales de manera eficiente y organizada
                        con nuestro sistema integral de seguimiento y control.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            className="fw-semibold"
                        >
                            Comenzar
                        </Button>
                        <Button
                            variant=""
                            className="text-dark fw-semibold text-decoration-none"
                        >
                            Saber más →
                        </Button>
                    </div>
                </div>

                <div className="position-relative mt-5">
                    <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100">
                        <div className="bg-gradient" />
                    </div>
                </div>
            </Container>
        </div>
    );
}
