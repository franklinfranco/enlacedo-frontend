import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaNoticias.css';

const API_URL = process.env.REACT_APP_API_URL; // <-- variable de entorno

function ListaNoticias() {
    const [noticias, setNoticias] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState('');

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const resNoticias = await fetch(`${API_URL}/noticias`);
                if (!resNoticias.ok) throw new Error(`HTTP error! status: ${resNoticias.status}`);
                const dataNoticias = await resNoticias.json();
                setNoticias(dataNoticias);
            } catch (err) {
                console.error("Error fetching noticias:", err);
                setError('Error al cargar las noticias. Por favor, intenta de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        const fetchSecciones = async () => {
            try {
                const resSecciones = await fetch(`${API_URL}/secciones`);
                if (!resSecciones.ok) throw new Error(`HTTP error! status: ${resSecciones.status}`);
                const dataSecciones = await resSecciones.json();
                setSecciones(dataSecciones);
            } catch (err) {
                console.error("Error fetching secciones", err);
                setError("Error al cargar las secciones. Por favor, intente de nuevo más tarde.");
            }
        };

        fetchNoticias();
        fetchSecciones();
    }, []);

    const handleAgregarNoticia = () => navigate('/registronoticia');
    const handleModificarNoticia = (id_noticia) => navigate(`/modificarnoticia/${id_noticia}`);

    const handleEliminarNoticia = async (id_noticia) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) return;

        try {
            const res = await fetch(`${API_URL}/noticias/${id_noticia}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            setNoticias(noticias.filter(noticia => noticia.id_noticia !== id_noticia));
            alert('Noticia eliminada exitosamente.');
        } catch (err) {
            console.error("Error deleting noticia:", err);
            setError('Error al eliminar la noticia. Por favor, intenta de nuevo.');
        }
    };

    const noticiasFiltradas = seccionSeleccionada
        ? noticias.filter(noticia => noticia.id_seccion === parseInt(seccionSeleccionada))
        : noticias;

    if (loading) return <div className="loading-message">Cargando noticias...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (noticias.length === 0) return <div className="no-news-message">No hay noticias registradas.</div>;

    return (
        <div className="news-list-container">
            <h2 className="news-list-title">Lista de Noticias</h2>

            <div className="filter-container">
                <label htmlFor="seccion-filter">Filtrar por Sección: </label>
                <select
                    id="seccion-filter"
                    value={seccionSeleccionada}
                    onChange={(e) => setSeccionSeleccionada(e.target.value)}
                >
                    <option value="">Todas las Secciones</option>
                    {secciones.map(seccion => (
                        <option key={seccion.id_seccion} value={seccion.id_seccion}>
                            {seccion.nombre_seccion}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleAgregarNoticia} className="add-news-button">Agregar Noticia</button>

            <table className="news-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Fecha de Publicación</th>
                        <th>Estado</th>
                        <th>Sección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {noticiasFiltradas.map(noticia => (
                        <tr key={noticia.id_noticia}>
                            <td>{noticia.titulo}</td>
                            <td>{noticia.fecha_publicacion}</td>
                            <td>{noticia.estado}</td>
                            <td>{secciones.find(seccion => seccion.id_seccion === noticia.id_seccion)?.nombre_seccion || 'Sin Sección'}</td>
                            <td>
                                <div className="actions-container">
                                    <button onClick={() => handleModificarNoticia(noticia.id_noticia)} className="edit-button">Modificar</button>
                                    <button onClick={() => handleEliminarNoticia(noticia.id_noticia)} className="delete-button">Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaNoticias;
