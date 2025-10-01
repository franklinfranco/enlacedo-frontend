import React from 'react';

const API_URL = process.env.REACT_APP_API_URL; // Variable de entorno para backend

function AdBanner({ anuncio }) {
  if (!anuncio || !anuncio.imagen_anuncio || !anuncio.url_anuncio) {
    return null; // No mostrar nada si faltan datos esenciales
  }

  return (
    <div className="ad-banner">
      <a href={anuncio.url_anuncio} target="_blank" rel="noopener noreferrer">
        <img
          src={`${API_URL}/imagenes-anuncios/${anuncio.imagen_anuncio}`}
          alt={anuncio.nombre_anunciante || 'Anuncio'}
          className="ad-banner-img"
        />
      </a>
    </div>
  );
}

export default AdBanner;
