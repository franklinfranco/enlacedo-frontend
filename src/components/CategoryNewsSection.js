import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import './CategoryNewsSection.css';

function CategoryNewsSection({ allNews, categoryId, categoryName }) {
  const navigate = useNavigate();

  const noticiasFiltradas = allNews.filter(
    news => news.estado === 'publicado' && news.id_seccion === categoryId
  );

  const handleNewsClick = (id_noticia) => navigate(`/noticias/${id_noticia}`);

  if (noticiasFiltradas.length === 0) return null;

  return (
    <div className="category-news-section">
      <h2>{categoryName}</h2>
      <div className="news-grid">
        {noticiasFiltradas.map(news => (
          <div
            key={news.id_noticia}
            className="news-item"
            onClick={() => handleNewsClick(news.id_noticia)}
          >
            <div className="news-image">
              <img
                src={news.url_imagen_principal || news.url || 'https://via.placeholder.com/300x200'}
                alt={news.titulo}
              />
            </div>
            <div className="news-details">
              <h3>{news.titulo}</h3>
              <p className="news-date">
                {moment(news.fecha_publicacion).locale('es').format('D MMMM YYYY')}
              </p>
              {news.subtitulo && <p className="news-subtitulo">{news.subtitulo}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryNewsSection;
