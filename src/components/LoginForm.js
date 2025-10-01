import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
    const [correo_electronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleCorreoElectronicoChange = (event) => {
        setCorreoElectronico(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoginSuccess(false);

        try {
            const backendURL = 'https://article-philip-kid-predictions.trycloudflare.com';
            const response = await fetch(`${backendURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo_electronico, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Inicio de sesión exitoso:', data);

                // Store user data in localStorage
                localStorage.setItem('autorId', data.autorId); // Aquí está el cambio
                localStorage.setItem('nombre_autor', data.nombre);
                localStorage.setItem('codigo_autor', data.autorId);

                setLoginSuccess(true);
                navigate('/listadonoticia');
            } else {
                let errorMessage = 'Error al iniciar sesión. Credenciales inválidas.';
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        errorMessage = await response.text();
                    }
                } catch (e) {
                    console.error("Error leyendo la respuesta:", e);
                }
                setError(errorMessage);
                console.error('Error al iniciar sesión:', response.status);
            }
        } catch (error) {
            console.error('Error de red:', error);
            setError('Error de red al intentar iniciar sesión.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Iniciar Sesión</h2>
            {error && <p className="login-error-message">{error}</p>}
            {loginSuccess && <p className="login-success-message">Inicio de sesión exitoso. ¡Redirigiendo...!</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label htmlFor="correo_electronico" className="login-label">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="correo_electronico"
                        value={correo_electronico}
                        onChange={handleCorreoElectronicoChange}
                        required
                        className="login-input"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="login-label">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className="login-input"
                    />
                </div>
                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default LoginForm;
