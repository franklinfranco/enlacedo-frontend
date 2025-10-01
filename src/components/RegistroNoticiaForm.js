import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistroNoticiaForm.css';

// Define el estado inicial del formulario una sola vez
const INITIAL_FORM_STATE = {
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
};

// Función para verificar si el usuario está autenticado
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
            // Si no está logueado, redirigir al login
            navigate('/login');
        }
    }, [navigate]);

    return { isLoggedIn, userData };
};

function RegistroNoticiaForm({ apiUrl }) {
    const { isLoggedIn, userData } = useAuth();
    const navigate = useNavigate(); // Hook de navegación
    
    // Inicializa el formulario con el estado inicial
    const [form, setForm] = useState(INITIAL_FORM_STATE);

    const [secciones, setSecciones] = useState([]);
    const [error, setError] = useState('');
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [loading, setLoading] = useState(true);

    // Función para resetear el formulario (manteniendo el ID del autor)
    const resetForm = () => {
        setForm({ 
            ...INITIAL_FORM_STATE, 
            id_autor: userData?.autorId || '' 
        });
    };

    useEffect(() => {
        if (isLoggedIn) {
            if (userData) {
                // Setea el id_autor al cargar los datos del usuario
                setForm(prev => ({ ...prev, id_autor: userData.autorId }));
            }

            const fetchSecciones = async () => {
                try {
                    const res = await fetch(`${apiUrl}/secciones`);
                    if (!res.ok) throw new Error('Fallo al obtener secciones');
                    const data = await res.json();
                    setSecciones(data);
                } catch (err) {
                    console.error(err);
                    setError('Error al cargar las secciones');
                } finally {
                    setLoading(false);
                }
            };
            fetchSecciones();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, userData, apiUrl]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setRegistroExitoso(false);

        if (!form.titulo || !form.contenido || !form.id_seccion) {
            return setError('El título, contenido y sección son obligatorios.');
        }

        try {
            const res = await fetch(`${apiUrl}/noticias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (res.ok) {
                setRegistroExitoso(true);
                resetForm(); // <-- LIMPIAR FORMULARIO DESPUÉS DEL ÉXITO
                console.log('Registro exitoso:', data);
            } else {
                setError(data.message || `Error (${res.status}): Fallo al registrar la noticia.`);
            }
        } catch (err) {
            console.error(err);
            setError('Error de red al intentar registrar la noticia.');
        }
    };

    // Función para el botón "Volver Atrás"
    const handleGoBack = () => {
        navigate(-1); // Vuelve a la página anterior
    };

    if (!isLoggedIn) return null;
    if (loading) return <div>Cargando información del autor y secciones...</div>;

    return (
        <div className="registro-noticia-container">
            {userData && (
                <div className="user-info">
                    <p>Nombre del Autor: {userData.nombreAutor} (ID: {userData.autorId})</p>
                </div>
            )}
            <h2>Registrar Noticia</h2>
            {error && <p className="error">{error}</p>}
            {registroExitoso && <p className="success">Noticia registrada exitosamente.</p>}
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
                            <textarea id={name} name={name} value={form[name]} onChange={handleChange} className="registro-noticia-textarea" />
                        ) : (
                            <input type={type} id={name} name={name} value={form[name]} onChange={handleChange} className="registro-noticia-input" required={required} />
                        )}
                    </div>
                ))}

                <div className="registro-noticia-input-group">
                    <label htmlFor="estado">Estado:</label>
                    <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
                        <option value="publicado">Publicado</option>
                        <option value="borrador">Borrador</option>
                    </select>
                </div>

                <div className="registro-noticia-input-group">
                    <label htmlFor="id_seccion">Sección:</label>
                    <select id="id_seccion" name="id_seccion" value={form.id_seccion} onChange={handleChange} required>
                        <option value="">Selecciona una sección</option>
                        {secciones.map(sec => (
                            <option key={sec.id_seccion} value={sec.id_seccion}>{sec.nombre_seccion}</option>
                        ))}
                    </select>
                </div>

                <input type="hidden" name="id_autor" value={form.id_autor} />

                {[
                    { label: '¿Destacada?', name: 'es_destacada' },
                    { label: '¿Principal?', name: 'principal' }
                ].map(({ label, name }) => (
                    <div className="registro-noticia-input-group" key={name}>
                        <label htmlFor={name}>{label}</label>
                        <input type="checkbox" id={name} name={name} checked={form[name]} onChange={handleChange} />
                    </div>
                ))}

                <div className="form-actions">
                    {/* BOTÓN VOLVER ATRÁS */}
                    <button 
                        type="button" 
                        onClick={handleGoBack} 
                        className="registro-noticia-button back-button">
                        Volver Atrás
                    </button>
                    {/* BOTÓN REGISTRAR */}
                    <button type="submit" className="registro-noticia-button">Registrar</button>
                </div>
            </form>
        </div>
    );
}

export default RegistroNoticiaForm;