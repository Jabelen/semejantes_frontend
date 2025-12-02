import React, { useState } from 'react';
// Asegúrate de que este archivo CSS exista o adapta el nombre
import './Register.css'; 
import Header from '../components/Header';

const ROLES_OPTIONS = [
  'Administrador',
  'Consejero',
  'Terapeuta',
  'Mecánico',
  'Traductor',
  'Costura',
  'Apoyo a Niños',
  'Enfermería'
];

const Register = () => {
  // Estados para almacenar los valores de los campos de entrada
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES_OPTIONS[0]); // Inicializa con la primera opción

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página
    
    // Objeto con los datos del usuario a registrar
    const userData = {
      firstName,
      lastName,
      email,
      password, // Nota: La contraseña NUNCA debe ser enviada o almacenada en texto plano en una aplicación real.
      role
    };

    console.log('Datos de Registro:', userData);

    // Aquí iría la lógica para enviar 'userData' al API o servidor
    alert(`¡Cuenta registrada para ${firstName} ${lastName} con rol: ${role}!`);
    
    // Opcional: limpiar los campos después del envío exitoso
    // setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRole(ROLES_OPTIONS[0]);
  };

  return (
    <>
        <Header/>
        <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Crear Cuenta</h2>
            
            {/* Campo Nombre */}
            <div className="form-group">
            <label htmlFor="firstName">Nombre:</label>
            <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Tu nombre"
            />
            </div>

            {/* Campo Apellido */}
            <div className="form-group">
            <label htmlFor="lastName">Apellido:</label>
            <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Tu apellido"
            />
            </div>

            {/* Campo Correo Electrónico */}
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

            {/* Campo Contraseña */}
            <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
            />
            </div>

            {/* Campo Rol (Select/Desplegable) */}
            <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                required
            >
                {ROLES_OPTIONS.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
            </div>

            <button type="submit" className="signup-button">
            Registrarse
            </button>

            <div className="form-footer">
            <p>¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a></p>
            </div>
        </form>
        </div>
    </>
  );
};

export default Register;