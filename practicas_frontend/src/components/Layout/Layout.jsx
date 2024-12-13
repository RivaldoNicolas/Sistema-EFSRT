import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NAVY_BLUE = '#1a365d';
const LIGHT_BLUE = '#2563eb';
const ACCENT_BLUE = '#60a5fa';
const WHITE = '#ffffff';

const MainWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: ${WHITE};

  @media (max-width: 768px) {
    overflow-y: auto;
  }
`;

const StyledNavbar = styled(Navbar)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 75px;

  @media (max-width: 768px) {
    height: 65px;
  }
`;

const ContentSection = styled.div`
  background: linear-gradient(120deg, #f0f7ff 0%, #ffffff 100%);
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  min-height: calc(100vh - 75px);

  @media (max-width: 768px) {
    padding: 4rem 0;
    min-height: calc(100vh - 65px);
  }

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle at 0% 0%, ${ACCENT_BLUE}20 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, ${LIGHT_BLUE}20 0%, transparent 50%);
    z-index: 0;
    animation: gradientMove 15s ease infinite;
  }

  @keyframes gradientMove {
    0% { transform: translate(0, 0); }
    50% { transform: translate(-5%, -5%); }
    100% { transform: translate(0, 0); }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const FeatureCard = styled.div`
  background: linear-gradient(145deg, ${NAVY_BLUE}, ${LIGHT_BLUE});
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 30px rgba(37, 99, 235, 0.2);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const StyledButton = styled(Button).attrs(props => ({
    variant: props.$variant,
    size: props.$size,
}))`
  padding: ${props => props.$size === 'lg' ? '14px 32px' : '12px 28px'};
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    padding: 10px 24px;
    width: ${props => props.$fullWidth ? '100%' : 'auto'};
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }
`;

const AnimatedTitle = styled.h1`
  background: linear-gradient(120deg, ${NAVY_BLUE}, ${LIGHT_BLUE});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const ResponsiveStack = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Layout = () => {
    const [menuMovilVisible, setMenuMovilVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const features = [
        {
            icon: "💼",
            title: "Gestión Académica",
            description: "Control integral de experiencias formativas"
        },
        {
            icon: "📊",
            title: "Seguimiento EFSRT",
            description: "Monitoreo en tiempo real de prácticas"
        },
        {
            icon: "🎯",
            title: "Evaluación",
            description: "Sistema de evaluación estructurado"
        }
    ];

    return (
        <MainWrapper>
            <StyledNavbar expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtjWt8u8zfB-EVkIItTLQj4sAPiLsg3vmADg&s"
                            height={isMobile ? "40" : "50"}
                            alt="Logo IESTPPA"
                            className="me-2"
                        />
                        <span className={`${isMobile ? 'h5' : 'h4'} mb-0`} style={{ color: NAVY_BLUE }}>
                            IESTPPA
                        </span>
                    </Navbar.Brand>

                    <Navbar.Toggle className="border-0" onClick={() => setMenuMovilVisible(true)} />

                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                            <StyledButton
                                as={Link}
                                to="/login"
                                $variant="primary"
                            >
                                Iniciar Sesión
                            </StyledButton>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </StyledNavbar>

            <ContentSection>
                <Container>
                    <ContentWrapper>
                        <Row className="align-items-center g-4">
                            <Col lg={5}>
                                <AnimatedTitle>
                                    Sistema de Gestión EFSRT
                                </AnimatedTitle>
                                <p className="lead mb-4 text-secondary fw-bold">
                                    Transforma tu experiencia formativa con nuestra plataforma integral
                                </p>
                                <ResponsiveStack>
                                    <StyledButton
                                        as={Link}
                                        to="/login"
                                        $variant="primary"
                                        $size="lg"
                                        $fullWidth={isMobile}
                                    >
                                        Ingresar Ahora
                                    </StyledButton>
                                    <StyledButton
                                        as="a"
                                        href="https://ipadreabad.edu.pe/"
                                        $variant="outline-primary"
                                        $fullWidth={isMobile}
                                        target="_blank"
                                    >
                                        Explorar Más
                                    </StyledButton>
                                </ResponsiveStack>
                            </Col>
                            <Col lg={7}>
                                <Row className="g-4">
                                    {features.map((feature, index) => (
                                        <Col md={4} key={index}>
                                            <FeatureCard>
                                                <IconWrapper>{feature.icon}</IconWrapper>
                                                <h4 className="text-white fw-bold mb-3">
                                                    {feature.title}
                                                </h4>
                                                <p className="text-white-50 mb-0">
                                                    {feature.description}
                                                </p>
                                            </FeatureCard>
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                    </ContentWrapper>
                </Container>
            </ContentSection>

            <Offcanvas
                show={menuMovilVisible}
                onHide={() => setMenuMovilVisible(false)}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <span className="h5 mb-0" style={{ color: NAVY_BLUE }}>IESTPPA</span>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <StyledButton
                        as={Link}
                        to="/login"
                        $variant="primary"
                        $fullWidth
                        onClick={() => setMenuMovilVisible(false)}
                    >
                        Iniciar Sesión
                    </StyledButton>
                </Offcanvas.Body>
            </Offcanvas>
        </MainWrapper>
    );
};

export default Layout;
