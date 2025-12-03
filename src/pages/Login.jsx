import React, { useState } from "react";
import { useNavigate } from "react-router"; // Para redirigir al usuario
import "./Login.css";
import Header from "../components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook de navegación

  // Obtenemos la URL de la API desde las variables de entorno (.env)
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Hacemos la petición al Backend
      const response = await fetch(`${API_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Verificamos si hubo error
      if (!response.ok) {
        // Si el backend dice "fail", mostramos el mensaje (ej: "Tu cuenta aún no ha sido aprobada")
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // 3. ÉXITO: Guardamos el token y datos del usuario
      // Esto es clave para que las siguientes peticiones funcionen
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 4. Redirigir al usuario a la zona privada (ej: /base o /home)
      alert("¡Bienvenido!");
      navigate("/base");
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <>
      <div>
        <Header />
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
            <a href="/login/forgot-password">¿Olvidaste tu contraseña? </a>
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
