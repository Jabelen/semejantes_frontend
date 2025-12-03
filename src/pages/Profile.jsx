import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [myActivity, setMyActivity] = useState([]); // Eventos (Vol) o Solicitudes (Coord)
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        navigate("/login");
        return;
      }

      try {
        // 1. Obtener Datos del Usuario
        const userRes = await fetch(`${API_URL}/api/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userJson = await userRes.json();

        if (userJson.status === "success") {
          setUserData(userJson.data);
        }

        // 2. Cargar Historial según el Rol
        if (storedUser.role === "Volunteer") {
          // LOGICA VOLUNTARIO: Sus eventos
          const eventRes = await fetch(`${API_URL}/api/events`);
          const eventJson = await eventRes.json();
          if (eventJson.status === "success") {
            const participated = eventJson.data.filter(
              (ev) =>
                ev.participantes && ev.participantes.includes(storedUser.id)
            );
            setMyActivity(participated);
          }
        } else if (storedUser.role === "Coordinator") {
          // LOGICA COORDINADOR: Solicitudes que resolvió
          const reqRes = await fetch(`${API_URL}/api/requests`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const reqJson = await reqRes.json();
          if (reqJson.status === "success") {
            // Filtramos las que tengan 'resolvedBy' igual a mi ID
            const resolvedByMe = reqJson.data.filter(
              (req) => req.resolvedBy === storedUser.id
            );
            setMyActivity(resolvedByMe);
          }
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, API_URL]);

  // Función PDF (Solo para Voluntarios)
  const handleDownloadCertificate = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}/certificate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status === "success") {
        const doc = new jsPDF({ orientation: "landscape" });
        const data = json.data;
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(5);
        doc.rect(10, 10, 277, 190);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(0, 102, 204);
        doc.text("DIPLOMA DE HONOR", 148.5, 50, null, null, "center");
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Se otorga a:", 148.5, 80, null, null, "center");
        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.text(userData.username, 148.5, 100, null, null, "center");
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Por participar en: "${data.eventTitle}"`,
          148.5,
          130,
          null,
          null,
          "center"
        );
        doc.text(`Fecha: ${data.date}`, 148.5, 150, null, null, "center");
        doc.save(`certificado_${eventId}.pdf`);
      } else {
        alert("Error: " + json.message);
      }
    } catch (err) {
      alert("Error generando certificado");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!userData) return <div>Error de carga</div>;

  return (
    <div className="profile-wrapper">
      {/* --- TARJETA SUPERIOR (DATOS) --- */}
      <div className="user-info-card">
        <div className="avatar-section">
          <div
            className="avatar-circle"
            style={{
              backgroundColor:
                userData.role === "Coordinator" ? "#ffc107" : "#0066cc",
              color: userData.role === "Coordinator" ? "#333" : "white",
            }}
          >
            {userData.username.substring(0, 2).toUpperCase()}
          </div>
          <div className={`status-tag ${userData.status}`}>
            {userData.status === "active" ? "Activo" : "Pendiente"}
          </div>
        </div>

        <div className="info-section">
          <div className="info-row">
            <strong>Nombre:</strong> <span>{userData.username}</span>
          </div>
          <div className="info-row">
            <strong>Email:</strong> <span>{userData.email}</span>
          </div>
          <div className="info-row">
            <strong>Teléfono:</strong>{" "}
            <span>{userData.phone || "No registrado"}</span>
          </div>

          {/* Diferencia visual en el rol */}
          <div className="info-row">
            <strong>Rol:</strong>
            <span
              className={
                userData.role === "Coordinator" ? "role-coord" : "role-vol"
              }
            >
              {userData.role === "Coordinator" ? "Coordinador" : "Voluntario"}
            </span>
          </div>

          {userData.role === "Coordinator" && (
            <div className="info-row">
              <strong>Cargo:</strong> <span>{userData.position}</span>
            </div>
          )}

          <button onClick={handleLogout} className="btn-logout-link">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (HISTORIAL) --- */}
      <div className="history-section">
        {/* Título dinámico según rol */}
        <h3
          className="history-title"
          style={{
            backgroundColor:
              userData.role === "Coordinator" ? "#ffc107" : "#0066cc",
            color: userData.role === "Coordinator" ? "#333" : "white",
          }}
        >
          {userData.role === "Volunteer"
            ? "Historial de Eventos"
            : "Historial de Gestión"}
        </h3>

        {myActivity.length === 0 ? (
          <p className="no-events">
            {userData.role === "Volunteer"
              ? "Aún no has participado en eventos."
              : "Aún no has resuelto solicitudes."}
          </p>
        ) : (
          <div className="events-list">
            {/* Renderizado condicional de la lista */}
            {userData.role === "Volunteer"
              ? // VISTA VOLUNTARIO (Eventos + Certificado)
                myActivity.map((event) => (
                  <div key={event._id} className="history-card">
                    <div className="history-info">
                      <h4>{event.title || "Evento sin título"}</h4>
                      <p>
                        <strong>Fecha:</strong> {event.date}
                      </p>
                      <p>
                        <strong>Lugar:</strong> {event.place}
                      </p>
                    </div>
                    <div className="history-action">
                      <button
                        className="btn-download"
                        onClick={() => handleDownloadCertificate(event._id)}
                      >
                        Descargar certificado
                      </button>
                    </div>
                  </div>
                ))
              : // VISTA COORDINADOR (Solicitudes Resueltas)
                myActivity.map((req) => (
                  <div key={req._id} className="history-card coord-card">
                    <div className="history-info">
                      <h4>Solicitud: {req.title}</h4>
                      <p>
                        <strong>Beneficiario:</strong> {req.beneficiaryName}
                      </p>
                      <p>
                        <strong>Resolución:</strong>{" "}
                        {new Date(req.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="history-action">
                      <span className={`status-badge-small ${req.status}`}>
                        {req.status === "approved"
                          ? "Aprobada ✅"
                          : "Rechazada ❌"}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
