import React, { useState, useEffect } from "react";
import Slider from "../Slider";
// 1. IMPORTAMOS LOS ESTILOS COMPARTIDOS
import "../SharedSliderStyles.css";
import "./DashboardHome.css";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";

export default function DashboardHome({ setView, userRole }) {
  // ... (Todo el código del useEffect y fetchRecentEvents sigue IGUAL) ...
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
            .map((ev) => ({
              imgURL: ev.images[0],
              imgAlt: ev.title,
            }));

          if (latestEvents.length > 0) {
            setSlides(latestEvents);
          } else {
            setSlides([
              { imgURL: DEFAULT_IMAGE, imgAlt: "Sin eventos recientes" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching events for slider", error);
      }
    };

    fetchRecentEvents();
  }, [API_URL]);

  return (
    <div className="dash-home-container">
      <div className="dash-intro">
        {/* ... (Títulos y frase siguen igual) ... */}
        <h3 className="org-subtitle">ONG SEMEJANTES</h3>
        <h1 className="org-title">
          INTEGRANDO A PERSONAS <br /> CON DISCAPACIDAD
        </h1>
        <div className="org-quote-container">
          <p className="org-quote">
            Because every person is valuable, loved and has a purpose in God
          </p>
        </div>
      </div>

      {/* Botones Grandes (siguen igual) */}
      <div className="quick-actions-grid">
        {/* ... botones ... */}
        <button className="action-card" onClick={() => setView("requests")}>
          <span className="card-title">Beneficiarios</span>
          <span className="card-icon">📋</span>
        </button>
        <button className="action-card" onClick={() => setView("donations")}>
          <span className="card-title">Recursos</span>
          <span className="card-icon">🎁</span>
        </button>
        <button className="action-card" onClick={() => setView("events")}>
          <span className="card-title">Eventos</span>
          <span className="card-icon">📅</span>
        </button>
      </div>

      {/* 2. SLIDER ACTUALIZADO CON ESTILOS COMPARTIDOS */}
      <div className="slider-wrapper-centered" style={{ marginTop: "40px" }}>
        {slides.length > 0 ? (
          <Slider>
            {slides.map((slide, index) => {
              // 3. NUEVA ESTRUCTURA
              return (
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
              );
            })}
          </Slider>
        ) : (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              background: "#eee",
              borderRadius: "12px",
            }}
          >
            Cargando imágenes de eventos...
          </div>
        )}
      </div>
    </div>
  );
}
