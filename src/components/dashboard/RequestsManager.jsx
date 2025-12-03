import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";

export default function RequestsManager({ userRole }) {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    beneficiaryName: "",
    beneficiaryAge: "",
  });

  useEffect(() => {
    loadRequests();
  }, []);

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
      alert("Solicitud enviada");
      loadRequests();
      setFormData({
        title: "",
        description: "",
        beneficiaryName: "",
        beneficiaryAge: "",
      }); // Reset
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
      <h2>Solicitudes de Ayuda</h2>

      <div className="request-layout">
        {/* Formulario de Nueva Solicitud */}
        <div className="request-form-box">
          <h3>Nueva Solicitud</h3>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <input
              placeholder="Título"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Descripción del caso"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <input
              placeholder="Nombre Beneficiario"
              value={formData.beneficiaryName}
              onChange={(e) =>
                setFormData({ ...formData, beneficiaryName: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Edad"
              value={formData.beneficiaryAge}
              onChange={(e) =>
                setFormData({ ...formData, beneficiaryAge: e.target.value })
              }
            />
            <button type="submit" className="btn-primary">
              Enviar Solicitud
            </button>
          </form>
        </div>

        {/* Lista de Solicitudes */}
        <div className="request-list">
          <h3>Historial</h3>
          {requests.map((req) => (
            <div key={req._id} className={`request-item ${req.status}`}>
              <div className="req-header">
                <h4>{req.title}</h4>
                <span className={`badge ${req.status}`}>{req.status}</span>
              </div>
              <p>{req.description}</p>
              <small>
                Para: {req.beneficiaryName} ({req.beneficiaryAge} años)
              </small>

              {userRole === "Coordinator" && req.status === "pending" && (
                <div className="req-actions">
                  <button
                    onClick={() => handleResolve(req._id, "approved")}
                    className="btn-success"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleResolve(req._id, "rejected")}
                    className="btn-danger"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
