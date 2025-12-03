import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Register.css";
import Header from "../components/Header";

const Register = () => {
  // Estados comunes
  const [role, setRole] = useState("Volunteer"); // 'Volunteer' o 'Coordinator'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Estados específicos de Voluntario
  const [availability, setAvailability] = useState("");
  const [speciality, setSpeciality] = useState("");

  // Estados específicos de Coordinador
  const [position, setPosition] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Definir endpoint y cuerpo según el rol
    const endpoint =
      role === "Coordinator"
        ? "/api/auth/sign-up-coordinator"
        : "/api/auth/sign-up-volunteer";

    const bodyData = {
      username,
      email,
      password,
      phone,
      // Agregamos campos extra condicionalmente
      ...(role === "Coordinator" ? { position } : { availability, speciality }),
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si hay errores de validación (array) o mensaje simple
        if (data.errors) {
          const errorMsg = data.errors.map((err) => err.msg).join("\n");
          alert(`Error en los datos:\n${errorMsg}`);
        } else {
          alert(data.message || "Error al registrarse");
        }
        return;
      }

      // ÉXITO
      alert(
        data.message ||
          "Registro exitoso. Tu cuenta está pendiente de aprobación."
      );
      navigate("/login");
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
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Crear Cuenta</h2>

          {/* Selector de Rol */}
          <div className="form-group">
            <label htmlFor="role">Quiero registrarme como:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Volunteer">Voluntario</option>
              <option value="Coordinator">Coordinador</option>
            </select>
          </div>

          {/* Campos Comunes */}
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

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
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+569..."
            />
          </div>

          {/* Campos Específicos: VOLUNTARIO */}
          {role === "Volunteer" && (
            <>
              <div className="form-group">
                <label htmlFor="availability">Disponibilidad:</label>
                <input
                  type="text"
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  required
                  placeholder="Ej: Fines de semana, Lunes AM"
                />
              </div>
              <div className="form-group">
                <label htmlFor="speciality">Especialidad / Habilidad:</label>
                <input
                  type="text"
                  id="speciality"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  required
                  placeholder="Ej: Primeros auxilios, Cocina, Logística"
                />
              </div>
            </>
          )}

          {/* Campos Específicos: COORDINADOR */}
          {role === "Coordinator" && (
            <div className="form-group">
              <label htmlFor="position">Cargo / Posición:</label>
              <input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                placeholder="Ej: Director de Logística"
              />
            </div>
          )}

          <button type="submit" className="signup-button">
            Registrarse
          </button>

          <div className="form-footer">
            <p>
              ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
