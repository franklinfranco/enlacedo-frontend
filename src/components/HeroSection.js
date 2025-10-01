import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import moment from 'moment';
import 'moment/locale/es';
import { Link } from 'react-router-dom';

function HeroSection({ allNews = [], apiUrl }) {
    const [mainNews, setMainNews] = useState(null);
    const [authorName, setAuthorName] = useState('');

    useEffect(() => {
        if (allNews.length > 0) {
            // Busca noticia principal y destacada
            const principalNews = allNews.find(
                news => news.principal === true && news.es_destacada === true
            );
            setMainNews(principalNews);

            // Si tiene autor, lo busca
            if (principalNews && principalNews.id_autor) {
                fetchAuthorName(principalNews.id_autor);
            }
        }
    }, [allNews]);

    const fetchAuthorName = async (authorId) => {
        try {
            const response = await fetch(`${apiUrl}/autores/${authorId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const authorData = await response.json();
            setAuthorName(authorData.nombre_autor || '');
        } catch (error) {
            console.error('Error fetching author name:', error);
            setAuthorName('');
        }
    };

    if (!mainNews) {
        return <div className="hero-section">Cargando noticia principal...</div>;
    }

    const detailUrl = `/noticias/${mainNews.slug || mainNews.id_noticia}`;

    return (
        <div className="hero-section">
            <div className="hero-image">
                <img
                    src={mainNews.url_imagen_principal || mainNews.url || 'https://via.placeholder.com/1200x600'}
                    alt={mainNews.titulo}
                />
            </div>
            <div className="hero-content">
                <h2 className="hero-title">{mainNews.titulo}</h2>
                <p className="hero-date">
                    {moment(mainNews.fecha_publicacion).locale('es').format('LL')}
                    {authorName && (
                        <span className="hero-author"> por {authorName}</span>
                    )}
                </p>
                <p className="hero-excerpt">{mainNews.subtitulo}</p>
                <Link to={detailUrl} className="hero-button">
                    Leer Más
                </Link>
            </div>
        </div>
    );
}

export default HeroSection;
