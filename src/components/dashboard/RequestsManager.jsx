import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmModal from "../ConfirmModal";
import "./RequestsManager.css";

export default function RequestsManager({ userRole }) {
  const { addNotification } = useNotification();
  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    beneficiaryName: "",
    beneficiaryAge: "",
    beneficiaryPhone: "",
    beneficiaryEmail: "",
  });

  // Estado para confirmaciones (Aprobar, Rechazar, Eliminar)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState({
    type: null, // 'resolve' | 'delete'
    id: null,
    status: null, // Solo para 'resolve' (approved/rejected)
  });

  useEffect(() => {
    if (userRole === "Coordinator") {
      loadRequests();
    }
  }, [userRole]);

  const loadRequests = async () => {
    try {
      const res = await apiRequest("/api/requests");
      const sorted = res.data.sort((a, b) => (a.status === "pending" ? -1 : 1));
      setRequests(sorted);
    } catch (err) {
      console.error(err);
      addNotification("Error cargando solicitudes", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/api/requests", "POST", formData);
      addNotification(
        "Solicitud enviada correctamente. Estaremos en contacto.",
        "success"
      );

      if (userRole === "Coordinator") loadRequests();

      setFormData({
        title: "",
        description: "",
        beneficiaryName: "",
        beneficiaryAge: "",
        beneficiaryPhone: "",
        beneficiaryEmail: "",
      });
    } catch (err) {
      addNotification(err.message, "error");
    }
  };

  // --- Lógica de Confirmación ---
  const handleResolveClick = (id, status) => {
    setActionData({ type: "resolve", id, status });
    setConfirmOpen(true);
  };

  const handleDeleteClick = (id) => {
    setActionData({ type: "delete", id });
    setConfirmOpen(true);
  };

  const executeAction = async () => {
    const { type, id, status } = actionData;
    try {
      if (type === "resolve") {
        await apiRequest(`/api/requests/${id}/resolve`, "PATCH", { status });
        addNotification(
          `Solicitud ${status === "approved" ? "aprobada" : "rechazada"}`,
          "success"
        );
      } else if (type === "delete") {
        await apiRequest(`/api/requests/${id}`, "DELETE");
        addNotification("Solicitud eliminada", "success");
      }
      loadRequests();
    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      setConfirmOpen(false);
      setActionData({ type: null, id: null, status: null });
    }
  };

  // Texto dinámico para el modal
  const getModalMessage = () => {
    if (actionData.type === "delete")
      return "¿Estás seguro de eliminar esta solicitud permanentemente?";
    if (actionData.type === "resolve")
      return `¿Confirmas cambiar el estado a: ${
        actionData.status === "approved" ? "Aprobado" : "Rechazado"
      }?`;
    return "";
  };

  return (
    <div className="requests-manager-container">
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeAction}
        title={
          actionData.type === "delete" ? "Eliminar Solicitud" : "Confirmar Acción"
        }
        message={getModalMessage()}
      />

      <h2 className="requests-title">
        {userRole === "Coordinator"
          ? "Gestión de Solicitudes"
          : "Solicitar Ayuda"}
      </h2>
      <p className="requests-subtitle">
        {userRole === "Coordinator"
          ? "Revisa y gestiona las necesidades de la comunidad"
          : "Cuéntanos qué necesitas y cómo podemos apoyarte"}
      </p>

      <div
        className={
          userRole === "Coordinator" ? "coordinator-layout" : "volunteer-layout"
        }
      >
        {/* --- COLUMNA 1: FORMULARIO --- */}
        <div className="request-form-card">
          <h3>📝 Nueva Solicitud</h3>
          <p className="form-instructions">
            Ingresa los datos de la persona que requiere el apoyo y su contacto.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="req-input"
              placeholder="Título del caso (ej: Silla de ruedas para Juan)"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <div className="req-row">
              <input
                className="req-input"
                placeholder="Nombre Beneficiario"
                value={formData.beneficiaryName}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryName: e.target.value })
                }
                required
              />
              <input
                className="req-input"
                type="number"
                placeholder="Edad"
                style={{ width: "100px" }}
                value={formData.beneficiaryAge}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryAge: e.target.value })
                }
              />
            </div>

            <div className="req-row">
              <input
                className="req-input"
                type="tel"
                placeholder="Teléfono (+569...)"
                value={formData.beneficiaryPhone}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryPhone: e.target.value })
                }
                required
              />
              <input
                className="req-input"
                type="email"
                placeholder="Correo de contacto"
                value={formData.beneficiaryEmail}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryEmail: e.target.value })
                }
                required
              />
            </div>

            <textarea
              className="req-textarea"
              placeholder="Describe detalladamente la situación y qué se necesita..."
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />

            <button type="submit" className="btn-submit">
              Enviar Solicitud
            </button>
          </form>
        </div>

        {/* --- COLUMNA 2: LISTA (Solo Coordinador) --- */}
        {userRole === "Coordinator" && (
          <div className="requests-list-column">
            <h3 className="requests-list-title">Bandeja de Entrada</h3>

            {requests.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                No hay solicitudes registradas.
              </p>
            ) : (
              <div className="requests-grid">
                {requests.map((req) => (
                  <div
                    key={req._id}
                    className={`request-item-card ${req.status}`}
                  >
                    <div className="req-header">
                      <h4 className="req-title">{req.title}</h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span className={`status-pill ${req.status}`}>
                          {req.status === "pending"
                            ? "Pendiente"
                            : req.status === "approved"
                            ? "Aprobado"
                            : "Rechazado"}
                        </span>
                        <button
                          className="btn-mini btn-reject"
                          style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                          onClick={() => handleDeleteClick(req._id)}
                          title="Eliminar Solicitud"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="req-desc">{req.description}</p>

                    <div className="req-meta">
                      <strong>Beneficiario:</strong> {req.beneficiaryName} (
                      {req.beneficiaryAge} años)
                      {(req.beneficiaryPhone || req.beneficiaryEmail) && (
                        <div style={{ marginTop: "5px", fontSize: "0.8rem" }}>
                          📞 {req.beneficiaryPhone} | 📧 {req.beneficiaryEmail}
                        </div>
                      )}
                    </div>

                    {req.status === "pending" && (
                      <div className="req-actions">
                        <button
                          onClick={() => handleResolveClick(req._id, "approved")}
                          className="btn-mini btn-approve"
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => handleResolveClick(req._id, "rejected")}
                          className="btn-mini btn-reject"
                        >
                          ✕ Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}