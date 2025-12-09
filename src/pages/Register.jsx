import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useNotification } from "../context/NotificationContext";
import "./Register.css"; 
import Header from "../components/Header";

// Importamos la imagen de acción/voluntariado
import registerBg from "../assets/foto3.jpeg"; 

const Register = () => {
  const { addNotification } = useNotification();
  const [role, setRole] = useState("Volunteer");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [position, setPosition] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      role === "Coordinator"
        ? "/api/auth/sign-up-coordinator"
        : "/api/auth/sign-up-volunteer";

    const bodyData = {
      username,
      email,
      password,
      phone,
      ...(role === "Coordinator" ? { position } : { availability, speciality }),
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMsg = data.errors.map((err) => err.msg).join(". ");
          addNotification(`Error en los datos: ${errorMsg}`, "error");
        } else {
          addNotification(data.message || "Error al registrarse", "error");
        }
        return;
      }

      addNotification(data.message || "Registro exitoso. Tu cuenta está pendiente de aprobación.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Error de conexión:", error);
      addNotification("No se pudo conectar con el servidor.", "error");
    }
  };

  return (
    <div className="register-page">
      <Header />
      
      <div className="register-container">
        <div className="register-card">
          
          {/* SECCIÓN IZQUIERDA: IMAGEN INSPIRADORA */}
          <div className="register-image-section">
            <img src={registerBg} alt="Voluntarios trabajando" className="register-bg-image" />
            <div className="register-quote-box">
              <h3>Únete a Nosotros</h3>
              <p>"Tus manos son las herramientas que Dios usa para construir esperanza."</p>
            </div>
          </div>

          {/* SECCIÓN DERECHA: FORMULARIO */}
          <div className="register-form-section">
            <form onSubmit={handleSubmit}>
              <h2>Crear Cuenta</h2>
              <p className="register-subtitle">
                Completa tus datos para formar parte de esta gran familia
              </p>

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
                <label htmlFor="username">Nombre Completo</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Tu nombre y apellido"
                />
              </div>

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
                <label htmlFor="phone">Teléfono de Contacto</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+56 9 ..."
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
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {/* Campos Específicos: VOLUNTARIO */}
              {role === "Volunteer" && (
                <>
                  <div className="form-group">
                    <label htmlFor="availability">Disponibilidad</label>
                    <input
                      type="text"
                      id="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required
                      placeholder="Ej: Fines de semana, Lunes por la mañana"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="speciality">Habilidades o Especialidad</label>
                    <input
                      type="text"
                      id="speciality"
                      value={speciality}
                      onChange={(e) => setSpeciality(e.target.value)}
                      required
                      placeholder="Ej: Administración, Consejería, Terapeuta, Traductor"
                    />
                  </div>
                </>
              )}

              {/* Campos Específicos: COORDINADOR */}
              {role === "Coordinator" && (
                <div className="form-group">
                  <label htmlFor="position">Cargo o Posición</label>
                  <input
                    type="text"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    placeholder="Ej: Director de Logística Regional"
                  />
                </div>
              )}

              <button type="submit" className="signup-button">
                Registrarse
              </button>

              <div className="form-footer">
                <p>
                  ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión aquí</a>
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;