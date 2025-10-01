import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './CategoryPage.css';
import moment from 'moment';
import 'moment/locale/es';

function CategoryPage({ apiUrl }) {
    const { categorySlug } = useParams();
    const [categoryNews, setCategoryNews] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [authors, setAuthors] = useState({});
    const autorApiUrl = `${apiUrl}/autores`; // Variable de entorno
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryNews = async () => {
            try {
                const response = await fetch(`${apiUrl}/noticias`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // Filtrar por slug de categoría
                const filteredNews = data.filter(news => news.slug_seccion === categorySlug);
                setCategoryNews(filteredNews);

                // Nombre de la categoría
                setCategoryName(categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1));

                // Obtener autores únicos
                const authorIds = [...new Set(filteredNews.map(news => news.id_autor))];
                if (authorIds.length > 0) {
                    const authorPromises = authorIds.map(id =>
                        fetch(`${autorApiUrl}/${id}`).then(res => res.ok ? res.json() : null)
                    );
                    const authorResults = await Promise.all(authorPromises);
                    const authorMap = {};
                    authorResults.forEach(a => {
                        if (a) authorMap[a.id_autor] = a.nombre_autor;
                    });
                    setAuthors(authorMap);
                }
            } catch (error) {
                console.error('Error fetching category news:', error);
            }
        };

        fetchCategoryNews();
    }, [apiUrl, categorySlug, autorApiUrl]);

    const handleGoBack = () => navigate(-1);

    if (categoryNews.length === 0) {
        return <div className="category-page">No hay noticias para {categoryName}.</div>;
    }

    return (
        <div className="category-page">
            <button onClick={handleGoBack} className="back-button">← Volver atrás</button>
            <h1>{`Noticias de ${categoryName}`}</h1>
            <div className="category-news-list">
                {categoryNews.map(news => (
                    <Link key={news.id_noticia} to={`/noticias/${news.slug || news.id_noticia}`} className="news-link">
                        <div className="news-item">
                            <div className="news-image">
                                <img
                                    src={news.url_imagen_principal || news.url || 'https://via.placeholder.com/300'}
                                    alt={news.titulo}
                                />
                            </div>
                            <div className="news-details">
                                <h2 className="news-title">{news.titulo}</h2>
                                <p className="news-date">
                                    {moment(news.fecha_publicacion).locale('es').format('LL')}
                                    {authors[news.id_autor] && <span className="news-author"> por {authors[news.id_autor]}</span>}
                                </p>
                                {news.subtitulo && <p className="news-subtitle">{news.subtitulo}</p>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CategoryPage;
