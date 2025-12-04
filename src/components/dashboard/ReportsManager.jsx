import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./DashboardComponents.css";

export default function ReportsManager() {
  const [stats, setStats] = useState(null);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    apiRequest(`/api/reports/annual?year=${year}`)
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, [year]);

  if (!stats) return <div>Cargando reporte...</div>;

  return (
    <div className="module-container">
      <h2>Reporte Anual {year}</h2>
      <div className="cards-grid">
        <div className="dash-card">
          <h3>{stats.totalVolunteers}</h3>
          <p>Voluntarios</p>
        </div>
        <div className="dash-card">
          <h3>{stats.totalEvents}</h3>
          <p>Eventos</p>
        </div>
        <div className="dash-card">
          <h3>{stats.totalHoursContributed}</h3>
          <p>Horas Totales</p>
        </div>
      </div>
    </div>
  );
}
