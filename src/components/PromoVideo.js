import React, { useMemo } from 'react';
import './PromoVideo.css';

function PromoVideo() {
  // Lista de videos (IDs extraídos de tus enlaces)
  const videoIds = [
    '-LLP8xtEWbXE',
    'UwjsuWFoqFI',
    'XR0bmrNawA4',
    'dQJoF_JezZ4',
    'xjukKYM53Fc'
  ];

  // Selecciona un video aleatoriamente al cargar
  const randomVideoId = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    return videoIds[randomIndex];
  }, []);

  return (
    <div className="promo-video-container">
      <div className="promo-video-wrapper">
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${randomVideoId}?autoplay=1&mute=1&loop=1&playlist=${randomVideoId}`}
          title="Video Promocional"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default PromoVideo;
