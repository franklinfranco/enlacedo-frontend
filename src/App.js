import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import CategoryNewsSection from './components/CategoryNewsSection';
import Sidebar from './components/Sidebar';
import NewsDetail from './components/NewsDetail';
import CategoryPage from './components/CategoryPage';
import LoginForm from './components/LoginForm';
import RegistroForm from './components/RegistroForm';
import RegistroNoticiaForm from './components/RegistroNoticiaForm';
import ListadoNoticia from './components/ListaNoticias';
import ModificarNoticiaForm from './components/ModificarNoticiaForm';
import PromoVideo from './components/PromoVideo';

import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [allNews, setAllNews] = useState([]);
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    if (!API_URL) return console.error('API_URL no está definida');

    // Cargar noticias
    fetch(`${API_URL}/noticias`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setAllNews(data))
      .catch(err => console.error('Error fetching noticias:', err));

    // Cargar secciones
    fetch(`${API_URL}/secciones`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setSecciones(data))
      .catch(err => console.error('Error fetching secciones:', err));
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection allNews={allNews} />
              <PromoVideo />
              <Sidebar />
              {secciones.map(sec => (
                <CategoryNewsSection
                  key={sec.id_seccion}
                  categoryId={sec.id_seccion}
                  categoryName={sec.nombre_seccion}
                  allNews={allNews}
                />
              ))}
            </>
          } />
          <Route path="/noticias/:slug" element={<NewsDetail apiUrl={API_URL} />} />
          <Route path="/categoria/:categorySlug" element={<CategoryPage apiUrl={API_URL} />} />
          <Route path="/login" element={<LoginForm apiUrl={API_URL} />} />
          <Route path="/registro" element={<RegistroForm apiUrl={API_URL} />} />
          <Route path="/registronoticia" element={<RegistroNoticiaForm apiUrl={API_URL} />} />
          <Route path="/listadonoticia" element={<ListadoNoticia apiUrl={API_URL} />} />
          <Route path="/modificarnoticia/:id" element={<ModificarNoticiaForm apiUrl={API_URL} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
