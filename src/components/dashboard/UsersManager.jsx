import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./DashboardComponents.css";

export default function UsersManager() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await apiRequest("/api/users");
      // Filtramos solo los pendientes
      const pending = res.data.filter((u) => u.status === "pending");
      setUsers(pending);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    if (!confirm(`¿Estás seguro de cambiar el estado a ${status}?`)) return;
    try {
      await apiRequest(`/api/users/${id}/status`, "PATCH", { status });
      alert(`Usuario ${status === "active" ? "Aprobado" : "Rechazado"}`);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="module-container">
      <h2>Solicitudes de Registro (Pendientes)</h2>
      {users.length === 0 ? (
        <p>No hay usuarios pendientes de aprobación.</p>
      ) : (
        <div className="cards-grid">
          {users.map((user) => (
            <div
              key={user.id}
              className="dash-card"
              style={{ borderLeft: "5px solid #ffc107" }}
            >
              <h3>{user.username}</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Rol:</strong> {user.role}
              </p>
              {user.role === "Volunteer" && (
                <>
                  <p>
                    <strong>Disponibilidad:</strong> {user.availability}
                  </p>
                  <p>
                    <strong>Especialidad:</strong> {user.speciality}
                  </p>
                </>
              )}
              {user.role === "Coordinator" && (
                <p>
                  <strong>Cargo:</strong> {user.position}
                </p>
              )}

              <div className="card-actions" style={{ marginTop: "15px" }}>
                <button
                  onClick={() => handleStatus(user.id, "active")}
                  className="btn-success"
                >
                  Aprobar ✅
                </button>
                <button
                  onClick={() => handleStatus(user.id, "rejected")}
                  className="btn-danger"
                >
                  Rechazar ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
