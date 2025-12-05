import { useState } from "react";
import { apiRequest } from "../../utils/api";
import "./DashboardComponents.css";

export default function ReportsManager() {
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
      alert("Error al generar reporte: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("menu");
    setReportType(null);
    setStats(null);
  };

  return (
    <div className="module-container">
      <h2>Generar Reportes</h2>

      {/* --- MENÚ --- */}
      {step === "menu" && (
        <div
          className="cards-grid"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div
            className="dash-card action-card"
            onClick={() => handleSelectType("monthly")}
            style={{
              textAlign: "center",
              cursor: "pointer",
              border: "2px solid #007bff",
            }}
          >
            <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>📅</h1>
            <h3>Reporte Mensual</h3>
            <p>Estadísticas detalladas por mes específico.</p>
          </div>

          <div
            className="dash-card action-card"
            onClick={() => handleSelectType("annual")}
            style={{
              textAlign: "center",
              cursor: "pointer",
              border: "2px solid #28a745",
            }}
          >
            <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>📆</h1>
            <h3>Reporte Anual</h3>
            <p>Resumen general del año completo.</p>
          </div>
        </div>
      )}

      {/* --- FILTROS --- */}
      {step === "filters" && (
        <div
          className="form-container"
          style={{
            maxWidth: "400px",
            margin: "20px auto",
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            Configurar Reporte {reportType === "annual" ? "Anual" : "Mensual"}
          </h3>

          <form onSubmit={handleGenerate} className="dashboard-form">
            <label>Año:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2020"
              max="2030"
              required
            />

            {reportType === "monthly" && (
              <>
                <label>Mes:</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </>
            )}

            <div className="row" style={{ marginTop: "20px" }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn-danger"
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-success"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- RESULTADOS --- */}
      {step === "result" && stats && (
        <div className="results-container">
          <div
            className="results-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3>
              Resultados:{" "}
              {reportType === "annual" ? `Año ${year}` : `${month}/${year}`}
            </h3>
            <button onClick={handleReset} className="btn-primary">
              Generar Otro Reporte
            </button>
          </div>

          <div
            className="cards-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {/* Tarjeta de Eventos */}
            <div
              className="dash-card"
              style={{
                textAlign: "center",
                padding: "30px",
                borderTop: "5px solid #28a745",
              }}
            >
              <h1 style={{ fontSize: "3.5rem", color: "#28a745", margin: 0 }}>
                {stats.totalEvents}
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Eventos Realizados
              </p>
            </div>

            {/* Tarjeta de Horas */}
            <div
              className="dash-card"
              style={{
                textAlign: "center",
                padding: "30px",
                borderTop: "5px solid #ffc107",
              }}
            >
              <h1 style={{ fontSize: "3.5rem", color: "#ffc107", margin: 0 }}>
                {stats.totalHoursContributed}
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Horas Aportadas
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
