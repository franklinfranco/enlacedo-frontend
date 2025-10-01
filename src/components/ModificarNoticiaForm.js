import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RegistroNoticiaForm.css';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAutorId = localStorage.getItem('autorId');
        const storedNombreAutor = localStorage.getItem('nombre_autor');

        if (storedAutorId && storedNombreAutor) {
            setIsLoggedIn(true);
            setUserData({
                autorId: storedAutorId,
                nombreAutor: storedNombreAutor,
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return { isLoggedIn, userData };
};

function ModificarNoticiaForm({ apiUrl }) {
    const { isLoggedIn, userData } = useAuth();
    const [form, setForm] = useState({
        titulo: '',
        subtitulo: '',
        contenido: '',
        fecha_publicacion: '',
        fecha_actualizacion: '',
        id_seccion: '',
        id_autor: '',
        fuente_original: '',
        url_fuente: '',
        palabras_clave: '',
        es_destacada: false,
        estado: 'publicado',
        url: '',
        principal: false,
    });

    const [secciones, setSecciones] = useState([]);
    const [error, setError] = useState('');
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchSecciones = async () => {
            try {
                const res = await fetch(`${apiUrl}/secciones`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setSecciones(data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar las secciones');
            }
        };

        const fetchNoticia = async () => {
            try {
                const res = await fetch(`${apiUrl}/noticias/${id}`);
                if (!res.ok) throw new Error(`No se pudo obtener la noticia: ${res.status}`);
                const noticiaData = await res.json();

                const formatDate = (dateString) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const d = String(date.getDate()).padStart(2, '0');
                    const h = String(date.getHours()).padStart(2, '0');
                    const min = String(date.getMinutes()).padStart(2, '0');
                    return `${y}-${m}-${d}T${h}:${min}`;
                };

                setForm({
                    titulo: noticiaData.titulo || '',
                    subtitulo: noticiaData.subtitulo || '',
                    contenido: noticiaData.contenido || '',
                    fecha_publicacion: formatDate(noticiaData.fecha_publicacion),
                    fecha_actualizacion: formatDate(noticiaData.fecha_actualizacion),
                    id_seccion: noticiaData.id_seccion || '',
                    id_autor: noticiaData.id_autor || '',
                    fuente_original: noticiaData.fuente_original || '',
                    url_fuente: noticiaData.url_fuente || '',
                    palabras_clave: noticiaData.palabras_clave || '',
                    es_destacada: !!noticiaData.es_destacada,
                    estado: noticiaData.estado || 'publicado',
                    url: noticiaData.url || '',
                    principal: !!noticiaData.principal,
                });
            } catch (err) {
                console.error("Error fetching noticia:", err);
                setError("Error al cargar la noticia para modificar.");
                navigate('/listadonoticia');
            } finally {
                setLoading(false);
            }
        };

        fetchSecciones();
        fetchNoticia();
    }, [isLoggedIn, id, navigate, apiUrl]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setRegistroExitoso(false);

        if (!form.titulo || !form.contenido || !form.id_seccion) {
            return setError('El título, contenido y sección son obligatorios.');
        }

        try {
            const res = await fetch(`${apiUrl}/noticias/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                setRegistroExitoso(true);
                console.log('Modificación exitosa:', data);
                navigate('/listadonoticia');
            } else {
                setError(data.message || 'Error al modificar la noticia.');
            }
        } catch (err) {
            console.error(err);
            setError('Error de red al intentar modificar la noticia.');
        }
    };

    if (!isLoggedIn) return null;
    if (loading) return <div>Cargando información...</div>;

    return (
        <div className="registro-noticia-container">
            {userData && (
                <div className="user-info">
                    <p>Nombre del Autor: {userData.nombreAutor} (ID: {userData.autorId})</p>
                </div>
            )}
            <h2>Modificar Noticia</h2>
            {error && <p className="error">{error}</p>}
            {registroExitoso && <p className="success">Noticia modificada exitosamente.</p>}

            <form onSubmit={handleSubmit} className="registro-noticia-form">
                {[
                    { label: 'Título', name: 'titulo', type: 'text', required: true },
                    { label: 'Subtítulo', name: 'subtitulo', type: 'textarea' },
                    { label: 'Contenido', name: 'contenido', type: 'textarea', required: true },
                    { label: 'Fecha de Publicación', name: 'fecha_publicacion', type: 'datetime-local' },
                    { label: 'Fecha de Actualización', name: 'fecha_actualizacion', type: 'datetime-local' },
                    { label: 'Fuente Original', name: 'fuente_original', type: 'text' },
                    { label: 'URL Fuente', name: 'url_fuente', type: 'url' },
                    { label: 'Palabras Clave', name: 'palabras_clave', type: 'textarea' },
                    { label: 'URL', name: 'url', type: 'text' },
                ].map(({ label, name, type, required }) => (
                    <div className="registro-noticia-input-group" key={name}>
                        <label htmlFor={name}>{label}:</label>
                        {type === 'textarea' ? (
                            <textarea
                                id={name}
                                name={name}
                                value={form[name] || ''}
                                onChange={handleChange}
                                className="registro-noticia-textarea"
                            />
                        ) : (
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={form[name] || ''}
                                onChange={handleChange}
                                className="registro-noticia-input"
                                required={required}
                            />
                        )}
                    </div>
                ))}

                <div className="registro-noticia-input-group">
                    <label htmlFor="estado">Estado:</label>
                    <select
                        id="estado"
                        name="estado"
                        value={form.estado || 'publicado'}
                        onChange={handleChange}
                    >
                        <option value="publicado">Publicado</option>
                        <option value="borrador">Borrador</option>
                    </select>
                </div>

                <div className="registro-noticia-input-group">
                    <label htmlFor="id_seccion">Sección:</label>
                    <select
                        id="id_seccion"
                        name="id_seccion"
                        value={form.id_seccion || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una sección</option>
                        {secciones.map(sec => (
                            <option key={sec.id_seccion} value={sec.id_seccion}>
                                {sec.nombre_seccion}
                            </option>
                        ))}
                    </select>
                </div>

                <input type="hidden" name="id_autor" value={form.id_autor || ''} />

                {[
                    { label: '¿Destacada?', name: 'es_destacada' },
                    { label: '¿Principal?', name: 'principal' },
                ].map(({ label, name }) => (
                    <div className="registro-noticia-input-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input
                            type="checkbox"
                            id={name}
                            name={name}
                            checked={form[name] || false}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <button type="submit" className="registro-noticia-button">Guardar Cambios</button>
            </form>
        </div>
    );
}

export default ModificarNoticiaForm;
