import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import Header from "../components/Header";

// Importamos la imagen familiar
import loginBg from "../assets/foto1.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("¡Bienvenido a casa!"); // Mensaje más cálido
      navigate("/base", { replace: true });
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <div className="login-page">
      <Header />
      
      <div className="login-container">
        <div className="login-card">
          
          {/* SECCIÓN IZQUIERDA: IMAGEN EMOTIVA */}
          <div className="login-image-section">
            <img src={loginBg} alt="Comunidad" className="login-bg-image" />
            <div className="login-quote">
              "Donde hay fe, hay amor; donde hay amor, hay paz."
            </div>
          </div>

          {/* SECCIÓN DERECHA: FORMULARIO */}
          <div className="login-form-section">
            <form onSubmit={handleSubmit}>
              <h2>Bienvenido</h2>
              <p className="login-subtitle">Ingresa a tu cuenta para seguir colaborando</p>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nombre@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="login-button">
                Iniciar Sesión
              </button>

              <div className="form-footer">
                <a href="/login/forgot-password">¿Olvidaste tu contraseña?</a>
              </div>
              
              <hr style={{ margin: "20px 0", border: "0", borderTop: "1px solid #eee" }} />
              
              <div className="form-footer">
                <span>¿Aún no eres parte? </span>
                <a href="/create-account">Únete al equipo</a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;