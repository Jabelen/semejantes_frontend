import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api"; // Asegúrate de tener src/utils/api.js
import "./DashboardComponents.css";

export default function UsersManager() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await apiRequest("/api/users");
      // Filtrar solo pendientes
      setUsers(res.data.filter((u) => u.status === "pending"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await apiRequest(`/api/users/${id}/status`, "PATCH", { status });
      alert("Usuario actualizado");
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="module-container">
      <h2>Usuarios Pendientes</h2>
      {users.length === 0 && <p>No hay solicitudes pendientes.</p>}
      <div className="cards-grid">
        {users.map((u) => (
          <div key={u.id} className="dash-card">
            <h3>{u.username}</h3>
            <p>
              {u.email} - {u.role}
            </p>
            <button
              onClick={() => handleStatus(u.id, "active")}
              className="btn-success"
            >
              Aprobar
            </button>
            <button
              onClick={() => handleStatus(u.id, "rejected")}
              className="btn-danger"
            >
              Rechazar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
