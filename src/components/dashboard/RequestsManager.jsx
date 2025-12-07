import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./RequestsManager.css"; // Importamos el nuevo CSS

export default function RequestsManager({ userRole }) {
  const [requests, setRequests] = useState([]);
  
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
      // Ordenar: Pendientes primero
      const sorted = res.data.sort((a, b) => (a.status === 'pending' ? -1 : 1));
      setRequests(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/api/requests", "POST", formData);
      alert("Solicitud enviada correctamente. Estaremos en contacto.");

      if (userRole === "Coordinator") loadRequests();

      setFormData({
        title: "",
        description: "",
        beneficiaryName: "",
        beneficiaryAge: "",
      }); 
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolve = async (id, status) => {
    if(!confirm(`¿Confirmas cambiar el estado a: ${status === 'approved' ? 'Aprobado' : 'Rechazado'}?`)) return;
    try {
      await apiRequest(`/api/requests/${id}/resolve`, "PATCH", { status });
      loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="requests-manager-container">
      <h2 className="requests-title">
        {userRole === "Coordinator" ? "Gestión de Solicitudes" : "Solicitar Ayuda"}
      </h2>
      <p className="requests-subtitle">
        {userRole === "Coordinator" 
          ? "Revisa y gestiona las necesidades de la comunidad"
          : "Cuéntanos qué necesitas y cómo podemos apoyarte"}
      </p>

      {/* CONTENEDOR PRINCIPAL: Grid para Coord, Flex para Volunteer */}
      <div className={userRole === "Coordinator" ? "coordinator-layout" : "volunteer-layout"}>
        
        {/* --- COLUMNA 1: FORMULARIO (Siempre visible) --- */}
        <div className="request-form-card">
          <h3>📝 Nueva Solicitud</h3>
          <p className="form-instructions">
            Ingresa los datos de la persona que requiere el apoyo (silla de ruedas, alimentos, asesoría, etc).
          </p>
          
          <form onSubmit={handleSubmit}>
            <input
              className="req-input"
              placeholder="Título del caso (ej: Silla de ruedas para Juan)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            
            <div className="req-row">
              <input
                className="req-input"
                placeholder="Nombre Beneficiario"
                value={formData.beneficiaryName}
                onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                required
              />
              <input
                className="req-input"
                type="number"
                placeholder="Edad"
                style={{width: "100px"}}
                value={formData.beneficiaryAge}
                onChange={(e) => setFormData({ ...formData, beneficiaryAge: e.target.value })}
              />
            </div>

            <textarea
              className="req-textarea"
              placeholder="Describe detalladamente la situación y qué se necesita..."
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <p style={{textAlign: 'center', color: '#666', fontStyle:'italic'}}>
                No hay solicitudes registradas.
              </p>
            ) : (
              <div className="requests-grid">
                {requests.map((req) => (
                  <div key={req._id} className={`request-item-card ${req.status}`}>
                    
                    <div className="req-header">
                      <h4 className="req-title">{req.title}</h4>
                      <span className={`status-pill ${req.status}`}>
                        {req.status === 'pending' ? 'Pendiente' : 
                         req.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </div>

                    <p className="req-desc">{req.description}</p>
                    
                    <div className="req-meta">
                      <strong>Beneficiario:</strong> {req.beneficiaryName} ({req.beneficiaryAge} años)
                    </div>

                    {/* Acciones solo si está pendiente */}
                    {req.status === "pending" && (
                      <div className="req-actions">
                        <button
                          onClick={() => handleResolve(req._id, "approved")}
                          className="btn-mini btn-approve"
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => handleResolve(req._id, "rejected")}
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