import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmModal from "../ConfirmModal";
import "./UsersManager.css";

export default function UsersManager() {
  const { addNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para ConfirmModal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState({ id: null, status: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await apiRequest("/api/users");
      setUsers(res.data.filter((u) => u.status === "pending"));
    } catch (err) {
      console.error(err);
      addNotification("Error cargando usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (id, status) => {
    setActionData({ id, status });
    setConfirmOpen(true);
  };

  const executeStatusChange = async () => {
    const { id, status } = actionData;
    try {
      await apiRequest(`/api/users/${id}/status`, "PATCH", { status });
      addNotification(
        `Usuario ${status === "active" ? "aprobado" : "rechazado"} correctamente`,
        "success"
      );
      loadUsers();
    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      setConfirmOpen(false);
      setActionData({ id: null, status: null });
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="users-manager-container">
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeStatusChange}
        title="Confirmar Acción"
        message={`¿Estás seguro de que deseas ${
          actionData.status === "active" ? "aprobar" : "rechazar"
        } a este usuario?`}
      />

      <h2 className="users-title">Usuarios Pendientes</h2>
      <p className="users-subtitle">
        Gestiona las nuevas solicitudes de acceso a la plataforma
      </p>

      {loading && <p className="empty-state">Cargando usuarios...</p>}

      {!loading && users.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">✨</span>
          <p>¡Excelente! No hay solicitudes pendientes de revisión.</p>
        </div>
      )}

      <div className="users-grid">
        {users.map((u) => (
          <div key={u.id} className="user-card">
            <div className="user-avatar-circle">{getInitials(u.username)}</div>

            <h3 className="user-name">{u.username}</h3>
            <p className="user-email">{u.email}</p>

            <span className="user-role-badge">
              {u.role === "Coordinator" ? "Coordinador" : "Voluntario"}
            </span>

            <div className="user-actions">
              <button
                onClick={() => handleStatusClick(u.id, "active")}
                className="btn-user-action btn-approve"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleStatusClick(u.id, "rejected")}
                className="btn-user-action btn-reject"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}