import React from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header.jsx";
import FloatingButton from "../components/FloatingButton";
import "./Donations.css"; // Crearemos este CSS

export default function Donations() {
  const navigate = useNavigate();

  return (
    <div className="donations-page">
      <Header />

      <div className="donations-container">
        <h1 className="donations-title">Haz tu Aporte</h1>

        <div className="donations-card">
          <p className="donations-intro">
            Tu ayuda es fundamental para seguir integrando a personas con
            discapacidad en nuestra comunidad.
          </p>

          <div className="info-box">
            <h3>¿Cómo realizar una donación?</h3>
            <p>
              Actualmente recibimos donaciones de recursos materiales (sillas de
              ruedas, bastones, alimentos, etc.) de manera presencial para
              asegurar su correcta distribución.
            </p>

            <ul className="donations-steps">
              <li>
                <span className="icon">📍</span>
                <strong>En Sede:</strong> Acércate a cualquiera de nuestras
                oficinas en horario hábil.
              </li>
              <li>
                <span className="icon">📅</span>
                <strong>En Eventos:</strong> Revisa nuestro calendario.
                Realizamos colectas específicas en muchas de nuestras
                actividades.
              </li>
            </ul>
          </div>

          <button className="btn-go-events" onClick={() => navigate("/events")}>
            Ver Próximos Eventos de Colecta ➜
          </button>
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}
