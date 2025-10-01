import React, { useState } from 'react';
import './RegistroForm.css'; // Importa el archivo CSS

function RegistroForm({ apiUrl }) {
    const [nombre, setNombre] = useState('');
    const [biografia, setBiografia] = useState('');
    const [correo_electronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [registroExitoso, setRegistroExitoso] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setRegistroExitoso(false);

        if (password !== confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Usando apiUrl base
            const response = await fetch(`${apiUrl}/autores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, biografia, correo_electronico, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registro exitoso:', data);
                setRegistroExitoso(true);
                // Podrías redirigir al login si quieres
                // navigate('/login');
            } else {
                console.error('Error al registrar:', data);
                setError(data.message || 'Error al registrar el usuario.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setError('Error de red al intentar registrar el usuario.');
        }
    };

    return (
        <div className="container">
            <h2 className="heading">Registro de Nuevo Autor</h2>
            {error && <p className="error-message">{error}</p>}
            {registroExitoso && <p className="success-message">Registro exitoso. ¡Ahora puedes iniciar sesión!</p>}
            <form onSubmit={handleSubmit} className="form">
                <div>
                    <label htmlFor="nombre" className="label">Nombre:</label>
                    <input type="text" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required className="input" />
                </div>
                <div>
                    <label htmlFor="biografia" className="label">Biografía:</label>
                    <textarea id="biografia" value={biografia} onChange={e => setBiografia(e.target.value)} className="textarea" />
                </div>
                <div>
                    <label htmlFor="correo_electronico" className="label">Correo Electrónico:</label>
                    <input type="email" id="correo_electronico" value={correo_electronico} onChange={e => setCorreoElectronico(e.target.value)} required className="input" />
                </div>
                <div>
                    <label htmlFor="password" className="label">Contraseña:</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" />
                </div>
                <div>
                    <label htmlFor="confirmarPassword" className="label">Confirmar Contraseña:</label>
                    <input type="password" id="confirmarPassword" value={confirmarPassword} onChange={e => setConfirmarPassword(e.target.value)} required className="input" />
                </div>
                <button type="submit" className="button">Registrar</button>
            </form>
        </div>
    );
}

export default RegistroForm;
