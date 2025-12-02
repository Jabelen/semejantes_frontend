import React, { useState } from 'react';
import './Login.css'; // Importa los estilos CSS
import Header from '../components/Header';

const Login = () => {
  // Estados para almacenar los valores de los campos de entrada
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página por defecto
    
    // Aquí es donde típicamente se enviaría la información a un servidor.
    // Por ahora, solo mostraremos los valores en la consola.
    console.log('Formulario enviado:', { email, password });

    // Lógica de autenticación iría aquí...
    alert(`Intentando iniciar sesión con: ${email}`); 
    
    // Opcionalmente, limpiar los campos después del envío:
    // setEmail('');
    // setPassword('');
  };

  return (
    <>
        <div>
            <Header/>
        </div>
        <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            
            <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@dominio.com"
            />
            </div>

            <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Introduce tu contraseña"
            />
            </div>

            <button type="submit" className="login-button">
            Entrar
            </button>

            <div className="form-footer">
            <a href="/forgot-password">¿Olvidaste tu contraseña? </a>
            </div>
            <div className="form-footer">
            <a href="/create-account"> Crear nueva cuenta</a>
            </div>
        </form>
        </div>
    </>
  );
};

export default Login;

// Para usarlo, solo tienes que importarlo en tu componente principal (ej. App.js):
// import LoginForm from './LoginForm';
// function App() { return <LoginForm />; }