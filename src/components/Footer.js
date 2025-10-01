import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Enlacedo.com</h3>
          <p>Tu fuente de noticias confiable y actualizada. Mantente informado sobre los acontecimientos más importantes en República Dominicana y el mundo.</p>
        </div>
        <div className="footer-section links">
          <h3>Enlaces Útiles</h3>
          <ul>
            <li><a href="/politica-de-privacidad">Política de Privacidad</a></li>
            <li><a href="/terminos-de-uso">Términos de Uso</a></li>
            <li><a href="/contacto">Contacto</a></li>
            <li><a href="/publicidad">Publicidad</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/EnlacedoRD" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com/EnlacedoRD" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://www.instagram.com/enlacedord/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Enlacedo.com - Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;