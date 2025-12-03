import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import Header from "../components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. PROTECCIÓN: Si ya está logueado, lo mandamos al Dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 'replace: true' evita que se guarde esta redirección en el historial
      navigate("/base", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("¡Bienvenido!");

      // 2. TRUCO CLAVE: Usamos { replace: true }
      // Esto borra el "Login" del historial y pone "Base" en su lugar.
      // Así, si el usuario da "Atrás", no volverá al formulario de login.
      navigate("/base", { replace: true });
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
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
