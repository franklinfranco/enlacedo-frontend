import React, { useState, useEffect } from 'react';

function ListaSecciones({ apiUrl }) {
  const [secciones, setSecciones] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerSecciones = async () => {
      try {
        const response = await fetch(`${apiUrl}/secciones`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSecciones(data);
      } catch (e) {
        setError(e);
      } finally {
        setCargando(false);
      }
    };

    obtenerSecciones();
  }, [apiUrl]);

  if (cargando) return <div>Cargando secciones...</div>;
  if (error) return <div>Error al cargar las secciones: {error.message}</div>;

  return (
    <div>
      <h2>Lista de Secciones</h2>
      <ul>
        {secciones.map(seccion => (
          <li key={seccion.id_seccion}>{seccion.nombre_seccion}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListaSecciones;
