import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api"; // Asegúrate de que esta ruta sea correcta
import "./DashboardComponents.css";

// EL ERROR ESTABA AQUÍ: Falta 'default' o está mal escrito
export default function ReportsManager() {
  const [stats, setStats] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await apiRequest(`/api/reports/annual?year=${year}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando reportes...</div>;

  return (
    <div className="module-container">
      <h2>Reportes Anuales {year}</h2>

      {stats ? (
        <div className="cards-grid">
          <div
            className="dash-card"
            style={{
              textAlign: "center",
              padding: "30px",
              borderTop: "5px solid #007bff",
            }}
          >
            <h1 style={{ fontSize: "3rem", color: "#007bff", margin: 0 }}>
              {stats.totalVolunteers}
            </h1>
            <h3>Voluntarios Activos</h3>
          </div>
          <div
            className="dash-card"
            style={{
              textAlign: "center",
              padding: "30px",
              borderTop: "5px solid #28a745",
            }}
          >
            <h1 style={{ fontSize: "3rem", color: "#28a745", margin: 0 }}>
              {stats.totalEvents}
            </h1>
            <h3>Eventos Realizados</h3>
          </div>
          <div
            className="dash-card"
            style={{
              textAlign: "center",
              padding: "30px",
              borderTop: "5px solid #ffc107",
            }}
          >
            <h1 style={{ fontSize: "3rem", color: "#ffc107", margin: 0 }}>
              {stats.totalHoursContributed}
            </h1>
            <h3>Horas Aportadas</h3>
          </div>
        </div>
      ) : (
        <p>No hay datos disponibles para este año.</p>
      )}
    </div>
  );
}
