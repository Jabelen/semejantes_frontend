import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf"; // Librería para el PDF
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
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

        // 2. Obtener Historial de Eventos (Solo si es voluntario)
        if (storedUser.role === "Volunteer") {
          const eventRes = await fetch(`${API_URL}/api/events`); // Traemos todos
          const eventJson = await eventRes.json();

          if (eventJson.status === "success") {
            // Filtramos: Eventos donde YO soy participante
            const participatedEvents = eventJson.data.filter(
              (event) =>
                event.participantes &&
                event.participantes.includes(storedUser.id)
            );
            setMyEvents(participatedEvents);
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

  // --- FUNCIÓN PARA DESCARGAR CERTIFICADO ---
  const handleDownloadCertificate = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}/certificate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (json.status === "success") {
        // Crear PDF
        const doc = new jsPDF({ orientation: "landscape" });
        const data = json.data;

        // Diseño simple del diploma
        doc.setDrawColor(0, 102, 204); // Azul
        doc.setLineWidth(5);
        doc.rect(10, 10, 277, 190); // Marco

        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(0, 102, 204);
        doc.text("DIPLOMA DE HONOR", 148.5, 50, null, null, "center");

        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Se otorga el presente reconocimiento a:",
          148.5,
          80,
          null,
          null,
          "center"
        );

        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.text(userData.username, 148.5, 100, null, null, "center");

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Por su valiosa participación en el evento:`,
          148.5,
          120,
          null,
          null,
          "center"
        );

        doc.setFontSize(22);
        doc.text(
          `"${data.eventTitle || data.title}"`,
          148.5,
          135,
          null,
          null,
          "center"
        );

        doc.setFontSize(14);
        doc.text(
          `Fecha: ${data.date} | Duración: ${data.hours} horas`,
          148.5,
          150,
          null,
          null,
          "center"
        );
        doc.text(
          `Lugar: ${data.place || "Sede Central"}`,
          148.5,
          160,
          null,
          null,
          "center"
        );

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

  if (loading) return <div className="loading-msg">Cargando perfil...</div>;
  if (!userData)
    return <div className="error-msg">No se pudo cargar el usuario</div>;

  return (
    <div className="profile-wrapper">
      {/* --- TARJETA SUPERIOR (DATOS) --- */}
      <div className="user-info-card">
        <div className="avatar-section">
          {/* Círculo de Avatar */}
          <div className="avatar-circle">
            <span>
              Img
              <br />
              Cara
            </span>
          </div>
          {/* Triángulo decorativo rojo del dibujo */}
          <div className="red-triangle"></div>
        </div>

        <div className="info-section">
          <div className="info-row">
            <strong>Nombre:</strong> {userData.username}
          </div>
          <div className="info-row">
            <strong>Rut:</strong> {userData.id} (ID Interno)
          </div>
          <div className="info-row">
            <strong>Nro. cel:</strong> {userData.phone || "-"}
          </div>
          <div className="info-row">
            <strong>Correo:</strong> {userData.email}
          </div>
          <div className="info-row">
            <strong>Rol:</strong>{" "}
            {userData.role === "Volunteer" ? "Voluntario" : "Coordinador"}
          </div>

          <div className="history-button-container">
            <span className="history-label">Historial de eventos ^</span>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (HISTORIAL DE TARJETAS) --- */}
      {userData.role === "Volunteer" && (
        <div className="history-section">
          {myEvents.length === 0 ? (
            <p className="no-events">No hay eventos registrados aún.</p>
          ) : (
            myEvents.map((event, index) => (
              <div
                key={event._id}
                className={`event-history-card ${
                  index % 2 === 0 ? "border-green" : "border-blue"
                }`}
              >
                <div className="event-data">
                  <p>
                    <strong>Evento:</strong> {event.title || "Sin título"}
                  </p>
                  <p>
                    <strong>Rol desempeñado:</strong> Voluntario
                  </p>
                  <p>
                    <strong>Fecha:</strong> {event.date}
                  </p>
                </div>
                <div className="event-actions">
                  <button
                    className="btn-download-cert"
                    onClick={() => handleDownloadCertificate(event._id)}
                  >
                    Descargar certificado
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
