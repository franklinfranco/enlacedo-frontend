import React, { useState, useEffect } from 'react';
import './BreakingNews.css';

const API_URL = process.env.REACT_APP_API_URL;

function BreakingNews() {
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await fetch(`${API_URL}/noticias?destacada=true&limit=1`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBreakingNews(data);
      } catch (error) {
        console.error('Error fetching breaking news:', error);
      }
    };

    fetchBreakingNews();
  }, []);

  if (!breakingNews.length) {
    return (
      <div className="breaking-news-section">
        <div className="breaking-news-title">
          <span>AHORA:</span>
        </div>
        <div className="breaking-news-content">
          <p>Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="breaking-news-section">
      <div className="breaking-news-title">
        <span>AHORA:</span>
      </div>
      <div className="breaking-news-content">
        {breakingNews.map(news => (
          <p key={news.id_noticia}>
            {news.titulo} • {news.autor?.nombre_autor || 'Desconocido'} • {news.fecha_publicacion}
          </p>
        ))}
      </div>
    </div>
  );
}

export default BreakingNews;
