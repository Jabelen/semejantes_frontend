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
  // Esto impide que vea el formulario si presiona "Atrás" después de entrar.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/base", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardar sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("¡Bienvenido!");

      // 2. REDIRECCIÓN CON REPLACE:
      // 'replace: true' sustituye la entrada actual (Login) en el historial por la nueva (Base).
      // Así, el botón "Atrás" del navegador saltará el Login y te llevará a la página anterior a esa (ej: Home o Google).
      navigate("/base", { replace: true });
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
