import React from "react";
import { useNavigate } from "react-router";
import "./DashboardHome.css";

export default function DashboardHome({ setView, userRole }) {
  const navigate = useNavigate();

  return (
    <div className="dash-home-container">
      <div className="dash-intro">
        <h3 className="org-subtitle">PANEL DE GESTIÓN</h3>
        <h1 className="org-title">
          {userRole === "Coordinator"
            ? "BIENVENIDO COORDINADOR"
            : "HOLA VOLUNTARIO"}
        </h1>
        <div className="org-quote-container">
          <p className="org-quote">Gestiona y organiza para servir mejor.</p>
        </div>
      </div>

      <div className="profile-shortcut-container">
        <button
          className="action-card profile-card-wide"
          onClick={() => setView("profile")}
        >
          <span className="card-icon">👤</span>
          <div>
            <span className="card-title">Mi Perfil</span>
          </div>
        </button>
      </div>

      <div className="divider-line"></div>

      <div className="quick-actions-grid">
        {/* OPCIONES COORDINADOR */}
        {userRole === "Coordinator" && (
          <>
            <button className="action-card" onClick={() => setView("users")}>
              <span className="card-title">Aprobar Usuarios</span>
              <span className="card-icon">👥</span>
            </button>

            <button className="action-card" onClick={() => navigate("/events")}>
              <span className="card-title">Gestionar Eventos</span>
              <span className="card-icon">📅</span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/donations")}
            >
              <span className="card-title">Gestionar Donaciones</span>
              <span className="card-icon">🎁</span>
            </button>

            <button className="action-card" onClick={() => setView("requests")}>
              <span className="card-title">Resolver Solicitudes</span>
              <span className="card-icon">📝</span>
            </button>

            <button className="action-card" onClick={() => setView("reports")}>
              <span className="card-title">Ver Reportes</span>
              <span className="card-icon">📊</span>
            </button>
          </>
        )}

        {/* OPCIONES VOLUNTARIO */}
        {userRole === "Volunteer" && (
          <>
            <button className="action-card" onClick={() => navigate("/events")}>
              <span className="card-title">Inscribirme en Eventos</span>
              <span className="card-icon">🙋</span>
            </button>

            <button className="action-card" onClick={() => setView("requests")}>
              <span className="card-title">Solicitar Ayuda</span>
              <span className="card-icon">🙏</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
