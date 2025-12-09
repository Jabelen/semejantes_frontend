import { useState } from "react";
import { apiRequest } from "../../utils/api";
import { useNotification } from "../../context/NotificationContext";
import "./ReportsManager.css";

export default function ReportsManager() {
  const { addNotification } = useNotification();
  const [step, setStep] = useState("menu");
  const [reportType, setReportType] = useState(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectType = (type) => {
    setReportType(type);
    setStep("filters");
    setStats(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint = "";
      if (reportType === "annual") {
        endpoint = `/api/reports/annual?year=${year}`;
      } else {
        endpoint = `/api/reports/monthly?year=${year}&month=${month}`;
      }

      const res = await apiRequest(endpoint);
      setStats(res.data);
      setStep("result");
    } catch (err) {
      addNotification("Error al generar reporte: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("menu");
    setReportType(null);
    setStats(null);
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="reports-manager-container">
      <h2 className="reports-title">Generador de Reportes</h2>
      <p className="reports-subtitle">Obtén estadísticas detalladas de la gestión</p>

      {/* --- PASO 1: MENÚ DE SELECCIÓN --- */}
      {step === "menu" && (
        <div className="reports-menu-grid">
          <div className="report-option-card" onClick={() => handleSelectType("monthly")}>
            <span className="report-icon">📅</span>
            <h3>Reporte Mensual</h3>
            <p>Estadísticas detalladas mes a mes. Ideal para seguimiento a corto plazo.</p>
          </div>

          <div className="report-option-card" onClick={() => handleSelectType("annual")}>
            <span className="report-icon">📆</span>
            <h3>Reporte Anual</h3>
            <p>Resumen general del año completo. Visión macro de la gestión.</p>
          </div>
        </div>
      )}

      {/* --- PASO 2: FILTROS --- */}
      {step === "filters" && (
        <div className="report-config-card">
          <h3>
            Configurar Reporte {reportType === "annual" ? "Anual" : "Mensual"}
          </h3>

          <form onSubmit={handleGenerate} className="report-form">
            <div className="form-group">
              <label>Año:</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2020"
                max="2030"
                required
              />
            </div>

            {reportType === "monthly" && (
              <div className="form-group">
                <label>Mes:</label>
                <select
                  className="form-control"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  {monthNames.map((name, index) => (
                    <option key={index} value={index + 1}>{name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-generate"
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar Reporte"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- PASO 3: RESULTADOS --- */}
      {step === "result" && stats && (
        <div className="results-section">
          <div className="results-header">
            <h3>
              {reportType === "annual" 
                ? `Resultados Año ${year}` 
                : `Resultados ${monthNames[month - 1]} ${year}`}
            </h3>
            <button onClick={handleReset} className="btn-new-report">
              ↺ Nuevo Reporte
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card green">
              <h1 className="stat-number">{stats.totalEvents}</h1>
              <span className="stat-label">Eventos Realizados</span>
            </div>

            <div className="stat-card yellow">
              <h1 className="stat-number">{stats.totalHoursContributed}</h1>
              <span className="stat-label">Horas Aportadas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}