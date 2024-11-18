import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'bg-white shadow-lg' : 'bg-black'} transition-all`}>
            <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center logo-spin">
                    <i className="fas fa-graduation-cap fa-2x me-2 text-primary glow-icon"></i>
                    <span className={`fw-bold ${isScrolled ? 'text-dark' : 'text-white'} brand-text`}>
                        EFSRT Systema
                    </span>
                </Link>

                <button className="navbar-toggler floating" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <i className="fas fa-bars"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link to="/about" className={`nav-link ${isScrolled ? 'text-dark' : 'text-white'} mx-2 neon-hover`}>
                                <i className="fas fa-info-circle me-1 rotate-icon"></i> Acerca de
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className={`nav-link ${isScrolled ? 'text-dark' : 'text-white'} mx-3 neon-hover`}>
                                <i className="fas fa-envelope me-1 bounce-icon"></i> Contacto
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
