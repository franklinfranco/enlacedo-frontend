import React from 'react';
import './Sidebar.css';
import promoImage from '../promo.jpg'; // Si promo.jpg está directamente en src/
// O: import promoImage from './img/banners/promo.jpg'; // Si está en src/img/banners/

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="ad-banner">
        <img src={promoImage} alt="Banner Promocional" style={{ maxWidth: '100%', height: 'auto' }} />
        {/* Otros elementos de la barra lateral */}
      </div>
    </div>
  );
}

export default Sidebar;