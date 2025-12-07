import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./UsersManager.css"; // Importamos el nuevo CSS

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await apiRequest("/api/users");
      // Filtrar solo usuarios con estado 'pending'
      setUsers(res.data.filter((u) => u.status === "pending"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    const actionText = status === "active" ? "aprobar" : "rechazar";
    if (!confirm(`¿Estás seguro de ${actionText} a este usuario?`)) return;

    try {
      await apiRequest(`/api/users/${id}/status`, "PATCH", { status });
      // Recargar lista para reflejar cambios
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Función para obtener las iniciales del nombre (Ej: "Juan Perez" -> "JP")
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
      <h2 className="users-title">Usuarios Pendientes</h2>
      <p className="users-subtitle">Gestiona las nuevas solicitudes de acceso a la plataforma</p>

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
            
            {/* Avatar Visual */}
            <div className="user-avatar-circle">
              {getInitials(u.username)}
            </div>

            <h3 className="user-name">{u.username}</h3>
            <p className="user-email">{u.email}</p>
            
            <span className="user-role-badge">
              {u.role === "Coordinator" ? "Coordinador" : "Voluntario"}
            </span>

            <div className="user-actions">
              <button
                onClick={() => handleStatus(u.id, "active")}
                className="btn-user-action btn-approve"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleStatus(u.id, "rejected")}
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