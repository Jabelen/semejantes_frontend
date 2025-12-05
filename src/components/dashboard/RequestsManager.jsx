import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./DashboardComponents.css"; // Asegúrate de importar los estilos

export default function RequestsManager({ userRole }) {
  const [requests, setRequests] = useState([]);
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    beneficiaryName: "",
    beneficiaryAge: "",
  });

  useEffect(() => {
    // Solo cargamos la lista si es Coordinador
    if (userRole === "Coordinator") {
      loadRequests();
    }
  }, [userRole]);

  const loadRequests = async () => {
    try {
      const res = await apiRequest("/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/api/requests", "POST", formData);
      alert("Solicitud enviada correctamente");

      // Si es coordinador, recargamos la lista para ver la nueva
      if (userRole === "Coordinator") loadRequests();

      setFormData({
        title: "",
        description: "",
        beneficiaryName: "",
        beneficiaryAge: "",
      }); // Limpiar form
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolve = async (id, status) => {
    try {
      await apiRequest(`/api/requests/${id}/resolve`, "PATCH", { status });
      loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="module-container">
      <h2>
        {userRole === "Coordinator"
          ? "Gestión de Solicitudes"
          : "Solicitar Ayuda"}
      </h2>

      {/* LAYOUT DINÁMICO:
         - Si es Coordinador: Usa "request-layout" (Grilla 2 columnas: Form + Lista)
         - Si es Voluntario: Usa bloque simple centrado
      */}
      <div
        className={
          userRole === "Coordinator"
            ? "request-layout"
            : "request-single-layout"
        }
      >
        {/* 1. FORMULARIO (Visible para todos) */}
        <div
          className="request-form-box"
          style={
            userRole === "Volunteer"
              ? { maxWidth: "600px", margin: "0 auto" }
              : {}
          }
        >
          <h3>Nueva Solicitud</h3>
          <p
            style={{ marginBottom: "15px", color: "#666", fontSize: "0.9rem" }}
          >
            Ingresa los datos de la persona que necesita el recurso o apoyo.
          </p>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <input
              placeholder="Título del caso (ej: Silla de ruedas para Juan)"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Descripción detallada de la necesidad..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
            />
            <div className="row">
              <input
                placeholder="Nombre Beneficiario"
                value={formData.beneficiaryName}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryName: e.target.value })
                }
                required
                style={{ flex: 2 }}
              />
              <input
                type="number"
                placeholder="Edad"
                value={formData.beneficiaryAge}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryAge: e.target.value })
                }
                style={{ flex: 1 }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "10px" }}
            >
              Enviar Solicitud
            </button>
          </form>
        </div>

        {/* 2. LISTA DE HISTORIAL (Solo Coordinador) */}
        {userRole === "Coordinator" && (
          <div className="request-list">
            <h3>Solicitudes Recibidas</h3>
            {requests.length === 0 ? (
              <p>No hay solicitudes registradas.</p>
            ) : (
              requests.map((req) => (
                <div
                  key={req._id}
                  className={`request-item ${req.status}`}
                  style={{
                    marginBottom: "15px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    background: "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{req.title}</h4>
                    <span
                      className={`badge ${req.status}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#555" }}>
                    {req.description}
                  </p>
                  <small
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#888",
                    }}
                  >
                    Beneficiario: {req.beneficiaryName} ({req.beneficiaryAge}{" "}
                    años)
                  </small>

                  {/* Botones de Acción (Solo si está pendiente) */}
                  {req.status === "pending" && (
                    <div
                      className="req-actions"
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => handleResolve(req._id, "approved")}
                        className="btn-success"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleResolve(req._id, "rejected")}
                        className="btn-danger"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
