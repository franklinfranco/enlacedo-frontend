import React, { useState, useEffect, useRef } from 'react';
import './MainHeader.css';
import logo from '../img/logo.png';
import menud from '../img/img_menu.png';
import loginIcon from '../img/login.png';
import { Link, useNavigate } from 'react-router-dom';

function MainHeader() {
    const [currentDate, setCurrentDate] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showNewsList, setShowNewsList] = useState(false);
    const [secciones, setSecciones] = useState([]);
    const navigate = useNavigate();
    const loginMenuRef = useRef(null);

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const formattedDate = now.toLocaleString('es-DO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            setCurrentDate(formattedDate);
        };

        updateDate();
        const intervalId = setInterval(updateDate, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        const storedTwitterAutor = localStorage.getItem('twitter_autor');

        if (storedIsLoggedIn === 'true' && storedTwitterAutor === '1') {
            setIsLoggedIn(true);
            setShowNewsList(true);
        } else {
            setIsLoggedIn(false);
            setShowNewsList(false);
        }
    }, []);

    useEffect(() => {
        fetch('/secciones')
            .then(res => res.json())
            .then(data => setSecciones(data))
            .catch(err => console.error('Error cargando secciones:', err));
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLoginMenu = () => setIsLoginMenuOpen(!isLoginMenuOpen);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('twitter_autor');
        setIsLoggedIn(false);
        setShowNewsList(false);
        setIsLoginMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
                setIsLoginMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="main-header">
            <div className="top-bar">
                <div className="top-bar-left">
                    <span className="current-date">{currentDate}</span>
                </div>
                <div className="top-bar-right">
                    <span>Santiago 23°C / 26°C</span>
                </div>
            </div>

            <div className="header-content">
                <div className="menu-container">
                    <div className="menu" onClick={toggleMenu}>
                        <img src={menud} alt="Menú" />
                    </div>
                </div>

                <div className="logo">
                    <img src={logo} alt="Logo de Enlacedo" />
                </div>

                <div className="login" onClick={toggleLoginMenu} ref={loginMenuRef}>
                    <img src={loginIcon} alt="Login" />
                    <div className={`login-menu ${isLoginMenuOpen ? 'open' : ''}`}>
                        <ul>
                            {isLoggedIn ? (
                                <>
                                    <li><Link to="/lista-noticias" onClick={toggleLoginMenu}>Lista de Noticias</Link></li>
                                    <li><button onClick={handleLogout} className="logout-button">Cerrar Sesión</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" onClick={toggleLoginMenu}>Login</Link></li>
                                    <li><Link to="/registro" onClick={toggleLoginMenu}>Registrar</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Menú horizontal (siempre visible en desktop y móvil) */}
            <nav className="main-navigation">
                <ul>
                    {secciones.map(seccion => (
                        <li key={seccion.id_seccion}>
                            <Link to={`/categoria/${seccion.slug_seccion}`}>{seccion.nombre_seccion}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Menú hamburguesa (mismo contenido) */}
            <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    {secciones.map(seccion => (
                        <li key={seccion.id_seccion}>
                            <Link to={`/categoria/${seccion.slug_seccion}`} onClick={toggleMenu}>
                                {seccion.nombre_seccion}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MainHeader;
