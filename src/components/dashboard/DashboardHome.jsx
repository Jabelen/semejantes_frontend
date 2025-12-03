import React, { useState, useEffect } from "react";
import Slider from "../Slider";
import "../../components/SharedSliderStyles.css";
import "./DashboardHome.css";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";

export default function DashboardHome({ setView, userRole }) {
  const [slides, setSlides] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();

        if (data.status === "success") {
          const latestEvents = data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .filter((ev) => ev.images && ev.images.length > 0)
            .slice(0, 4)
            .map((ev) => ({ imgURL: ev.images[0], imgAlt: ev.title }));

          setSlides(
            latestEvents.length > 0
              ? latestEvents
              : [{ imgURL: DEFAULT_IMAGE, imgAlt: "Sin eventos recientes" }]
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecentEvents();
  }, [API_URL]);

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

      {/* --- BOTONES DINÁMICOS SEGÚN ROL --- */}
      <div className="quick-actions-grid">
        {/* Botones para COORDINADOR */}
        {userRole === "Coordinator" && (
          <>
            <button className="action-card" onClick={() => setView("users")}>
              <span className="card-title">Aprobar Usuarios</span>
              <span className="card-icon">👥</span>
            </button>

            <button className="action-card" onClick={() => setView("events")}>
              <span className="card-title">Crear Eventos</span>
              <span className="card-icon">📅</span>
            </button>

            <button
              className="action-card"
              onClick={() => setView("donations")}
            >
              <span className="card-title">Donaciones</span>
              <span className="card-icon">🎁</span>
            </button>

            <button className="action-card" onClick={() => setView("requests")}>
              <span className="card-title">Solicitudes</span>
              <span className="card-icon">📝</span>
            </button>

            <button className="action-card" onClick={() => setView("reports")}>
              <span className="card-title">Ver Reportes</span>
              <span className="card-icon">📊</span>
            </button>
          </>
        )}

        {/* Botones para VOLUNTARIO (Si entra un voluntario) */}
        {userRole === "Volunteer" && (
          <>
            <button className="action-card" onClick={() => setView("events")}>
              <span className="card-title">Inscribirme</span>
              <span className="card-icon">🙋</span>
            </button>
            <button className="action-card" onClick={() => setView("requests")}>
              <span className="card-title">Pedir Ayuda</span>
              <span className="card-icon">🙏</span>
            </button>
          </>
        )}
      </div>

      {/* Slider */}
      <div className="slider-wrapper-centered" style={{ marginTop: "40px" }}>
        {slides.length > 0 ? (
          <Slider>
            {slides.map((slide, index) => (
              <div key={index} className="slide-item-container">
                <img
                  src={slide.imgURL}
                  alt={slide.imgAlt}
                  className="slide-image-centered"
                />
                <div className="slide-title-overlay">
                  <h3 className="slide-title-text">{slide.imgAlt}</h3>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div style={{ padding: "50px", textAlign: "center" }}>
            Cargando...
          </div>
        )}
      </div>
    </div>
  );
}
