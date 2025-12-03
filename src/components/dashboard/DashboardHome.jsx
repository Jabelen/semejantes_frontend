import React from "react";
import Slider from "../Slider"; // Reutilizamos tu Slider existente
import images from "../../data/images"; // Reutilizamos tus imágenes
import "./DashboardHome.css"; // Estilos nuevos

export default function DashboardHome({ setView, userRole }) {
  return (
    <div className="dash-home-container">
      <div className="dash-intro">
        <h3 className="org-subtitle">ONG SEMEJANTES</h3>
        <h1 className="org-title">
          INTEGRANDO A PERSONAS <br /> CON DISCAPACIDAD
        </h1>
        <div className="org-quote-container">
          <p className="org-quote">
            Porque cada persona es valiosa, amada y tiene un propósito en Dios
          </p>
        </div>
      </div>

      {/* Botones Grandes de Navegación */}
      <div className="quick-actions-grid">
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

      {/* Slider abajo */}
      <div className="dash-slider-section">
        <Slider>
          {images.map((image, index) => {
            return <img key={index} src={image.imgURL} alt={image.imgAlt} />;
          })}
        </Slider>
      </div>
    </div>
  );
}
