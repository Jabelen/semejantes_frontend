import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/users/${storedUser.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          setUserData(response.data);
        } else {
          alert("Error cargando perfil");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate, API_URL]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return <div className="profile-container">Cargando perfil...</div>;
  if (!userData)
    return <div className="profile-container">No se encontró información.</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Mi Perfil</h1>

        <span
          className={`status-badge ${
            userData.status === "active" ? "status-active" : "status-pending"
          }`}
        >
          {userData.status === "active" ? "Cuenta Activa" : "Pendiente"}
        </span>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Usuario:</span>
            <span className="detail-value">{userData.username}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{userData.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rol:</span>
            <span className="detail-value">
              {userData.role === "Coordinator" ? "Coordinador" : "Voluntario"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Teléfono:</span>
            <span className="detail-value">{userData.phone || "-"}</span>
          </div>

          {userData.role === "Volunteer" && (
            <>
              <div className="detail-row">
                <span className="detail-label">Disponibilidad:</span>
                <span className="detail-value">{userData.availability}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Especialidad:</span>
                <span className="detail-value">{userData.speciality}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Horas Aportadas:</span>
                <span className="detail-value">
                  {userData.hoursContributed} hrs
                </span>
              </div>
            </>
          )}

          {userData.role === "Coordinator" && (
            <div className="detail-row">
              <span className="detail-label">Cargo:</span>
              <span className="detail-value">{userData.position}</span>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
