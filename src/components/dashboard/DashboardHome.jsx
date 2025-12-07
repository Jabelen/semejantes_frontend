import React from "react";
import { useNavigate } from "react-router"; // Importamos hook de navegación
import "./DashboardHome.css";

// Usamos la misma foto que en About para consistencia
import heroBg from "../../assets/foto1.jpeg";

export default function DashboardHome({ setView, userRole }) {
  const navigate = useNavigate(); // Hook para navegar a rutas como /events

  return (
    <div className="dash-home-container">
      
      {/* SECCIÓN HERO (Estilo About con filtro azul) */}
      <div className="dash-hero">
        <img src={heroBg} alt="Familia Semejantes" className="dash-hero-img" />
        <div className="dash-hero-content">
          <span className="org-subtitle">PANEL DE GESTIÓN</span>
          <h1 className="org-title">
            {userRole === "Coordinator" ? "Bienvenido, Coordinador" : "Hola, Voluntario"}
          </h1>
          <p className="org-quote">"Gestiona y organiza para servir mejor."</p>
        </div>
      </div>

      {/* CONTENEDOR DE ACCIONES (Botones Estilo Tarjetas) */}
      <div className="dashboard-actions-container">
        
        {/* VISTA COORDINADOR: 3 Arriba, 2 Abajo */}
        {userRole === "Coordinator" && (
          <>
            {/* FILA SUPERIOR (3 Botones) */}
            <div className="buttons-row top-row">
              {/* Botón 1 */}
              <button className="action-card" onClick={() => setView("users")}>
                <span className="card-icon">👥</span>
                <span className="card-title">Usuarios</span>
              </button>

              {/* Botón 2: Navega a la ruta /events */}
              <button className="action-card" onClick={() => navigate("/events")}>
                <span className="card-icon">📅</span>
                <span className="card-title">Eventos</span>
              </button>

              {/* Botón 3 */}
              <button className="action-card" onClick={() => setView("donations")}>
                <span className="card-icon">🎁</span>
                <span className="card-title">Inventario</span>
              </button>
            </div>

            {/* FILA INFERIOR (2 Botones Centrados) */}
            <div className="buttons-row bottom-row">
              {/* Botón 4 */}
              <button className="action-card" onClick={() => setView("requests")}>
                <span className="card-icon">📝</span>
                <span className="card-title">Solicitudes</span>
              </button>

              {/* Botón 5 */}
              <button className="action-card" onClick={() => setView("reports")}>
                <span className="card-icon">📊</span>
                <span className="card-title">Reportes</span>
              </button>
            </div>
          </>
        )}

        {/* VISTA VOLUNTARIO (Se mantienen sus 2 botones centrados) */}
        {userRole === "Volunteer" && (
          <div className="buttons-row bottom-row">
            <button className="action-card" onClick={() => navigate("/events")}>
              <span className="card-icon">🙋</span>
              <span className="card-title">Inscribirme</span>
            </button>
            <button className="action-card" onClick={() => setView("requests")}>
              <span className="card-icon">🙏</span>
              <span className="card-title">Pedir Ayuda</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}