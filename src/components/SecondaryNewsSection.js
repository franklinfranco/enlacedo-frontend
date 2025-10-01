import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import './SecondaryNewsSection.css';

function SecondaryNewsSection({ apiUrl }) {
  const [newsBySection, setNewsBySection] = useState({});
  const [secciones, setSecciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Traer secciones
        const resSecciones = await fetch(`${apiUrl}/secciones`);
        if (!resSecciones.ok) throw new Error('Error al traer secciones');
        const seccionesData = await resSecciones.json();
        setSecciones(seccionesData);

        // Traer noticias publicadas
        const resNoticias = await fetch(`${apiUrl}/noticias`);
        if (!resNoticias.ok) throw new Error('Error al traer noticias');
        const noticiasData = await resNoticias.json();

        const noticiasPublicadas = noticiasData.filter(n => n.estado === 'publicado');

        // Agrupar noticias por sección
        const grouped = {};
        seccionesData.forEach(sec => {
          grouped[sec.nombre_seccion] = [];
        });

        noticiasPublicadas.forEach(n => {
          const seccion = seccionesData.find(s => s.id_seccion === n.id_seccion);
          if (!seccion) return;

          const imagenPrincipal = n.imagenes?.find(img => img.es_principal);
          grouped[seccion.nombre_seccion].push({
            ...n,
            url_imagen_principal: imagenPrincipal?.imagen?.ruta_archivo || null,
          });
        });

        setNewsBySection(grouped);

      } catch (error) {
        console.error('Error fetching news by section:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleNewsClick = (id_noticia) => navigate(`/noticia/${id_noticia}`);

  return (
    <div className="secondary-news-section">
      {Object.entries(newsBySection).map(([sectionName, noticias]) => (
        <div key={sectionName} className="section-block">
          <h2>{sectionName}</h2>
          <div className="news-items">
            {noticias.map(news => (
              <div
                key={news.id_noticia}
                className="secondary-news-item"
                onClick={() => handleNewsClick(news.id_noticia)}
              >
                <div className="secondary-news-image">
                  <img
                    src={news.url_imagen_principal || 'https://via.placeholder.com/150'}
                    alt={news.titulo}
                  />
                </div>
                <div className="secondary-news-details">
                  <h3 className="secondary-news-title">{news.titulo}</h3>
                  <p className="secondary-news-date">
                    {moment(news.fecha_publicacion).locale('es').format('D MMMM YYYY')}
                  </p>
                  {news.subtitulo && <p className="secondary-news-subtitle">{news.subtitulo}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SecondaryNewsSection;
