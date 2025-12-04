import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import { formatChileDate } from "../utils/dateHelper";
import "./Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [myActivity, setMyActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

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
        const userRes = await fetch(`${API_URL}/api/users/${storedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userJson = await userRes.json();
        if (userJson.status === "success") setUserData(userJson.data);

        if (storedUser.role === "Volunteer") {
          const eventRes = await fetch(`${API_URL}/api/events`);
          const eventJson = await eventRes.json();
          if (eventJson.status === "success") {
            setMyActivity(
              eventJson.data.filter(
                (ev) =>
                  ev.participantes && ev.participantes.includes(storedUser.id)
              )
            );
          }
        } else if (storedUser.role === "Coordinator") {
          const reqRes = await fetch(`${API_URL}/api/requests`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const reqJson = await reqRes.json();
          if (reqJson.status === "success") {
            setMyActivity(
              reqJson.data.filter((req) => req.resolvedBy === storedUser.id)
            );
          }
        }
      } catch (error) {
        console.error("Error perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate, API_URL]);

  // --- FUNCIÓN DE FECHAS CORREGIDA (TODOTERRENO) ---
  const isEventPassed = (dateString, timeString) => {
    if (!dateString) return false;
    const now = new Date();

    // 1. Intentamos crear la fecha directamente (Maneja formato largo "Wed Dec 25..." y "2024-12-25")
    let eventDate = new Date(dateString);

    // 2. Si es inválida (NaN) o es formato simple YYYY-MM-DD (que a veces falla por zona horaria), lo hacemos manual
    if (
      isNaN(eventDate.getTime()) ||
      (typeof dateString === "string" &&
        dateString.match(/^\d{4}-\d{2}-\d{2}$/))
    ) {
      // Solo tomamos los primeros 10 caracteres para limpiar residuos ISO
      const cleanDate = dateString.substring(0, 10);
      const [year, month, day] = cleanDate.split("-").map(Number);
      eventDate = new Date(year, month - 1, day);
    }

    // 3. Aplicamos la hora exacta
    if (timeString && timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      eventDate.setHours(23, 59, 59, 999); // Final del día
    }

    // 4. Comparar
    return now > eventDate;
  };

  // --- CERTIFICADO ---
  const handleDownloadCertificate = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}/certificate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (json.status === "success") {
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });
        const data = json.data;
        const centerX = doc.internal.pageSize.getWidth() / 2;
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Marco Azul Doble
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(1);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        doc.setLineWidth(2);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

        // Textos
        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 102, 204);
        doc.text("ONG SEMEJANTES", centerX, 40, { align: "center" });

        doc.setFontSize(42);
        doc.text("CERTIFICADO DE PARTICIPACIÓN", centerX, 65, {
          align: "center",
        });

        doc.setFont("times", "normal");
        doc.setFontSize(18);
        doc.setTextColor(60, 60, 60);
        doc.text("Se otorga el presente reconocimiento a:", centerX, 90, {
          align: "center",
        });

        doc.setFont("times", "bolditalic");
        doc.setFontSize(34);
        doc.setTextColor(0, 0, 0);
        doc.text(userData.username.toUpperCase(), centerX, 110, {
          align: "center",
        });

        // Línea bajo nombre
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.5);
        doc.line(centerX - 80, 115, centerX + 80, 115);

        doc.setFont("times", "normal");
        doc.setFontSize(18);
        doc.setTextColor(60, 60, 60);
        doc.text("Por su invaluable aporte en el evento:", centerX, 135, {
          align: "center",
        });

        doc.setFont("times", "bold");
        doc.setFontSize(26);
        doc.setTextColor(0, 102, 204);
        doc.text(`"${data.eventTitle || data.title}"`, centerX, 150, {
          align: "center",
        });

        doc.setFont("times", "italic");
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Fecha: ${formatChileDate(data.date)}  |  Horas: ${data.hours}`,
          centerX,
          165,
          { align: "center" }
        );

        // Firmas
        const footerY = pageHeight - 35;
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.5);
        doc.setFont("times", "normal");
        doc.setFontSize(12);

        doc.line(50, footerY, 110, footerY);
        doc.text("Coordinador de Voluntariado", 80, footerY + 8, {
          align: "center",
        });

        doc.line(pageWidth - 110, footerY, pageWidth - 50, footerY);
        doc.text("Director ONG Semejantes", pageWidth - 80, footerY + 8, {
          align: "center",
        });

        doc.save(`Certificado_${eventId}.pdf`);
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

  if (loading) return <div className="loading-msg">Cargando...</div>;
  if (!userData) return <div className="error-msg">Error.</div>;

  return (
    <div className="profile-wrapper">
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
            <strong>Rol:</strong> <span>{userData.role}</span>
          </div>
          {userData.role === "Volunteer" && (
            <div className="info-row">
              <strong>Horas:</strong>{" "}
              <span>{userData.hoursContributed} hrs</span>
            </div>
          )}
          {userData.role === "Coordinator" && (
            <div className="info-row">
              <strong>Cargo:</strong> <span>{userData.position}</span>
            </div>
          )}

          <div className="logout-container">
            <button onClick={handleLogout} className="btn-logout-sketch">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {userData.role === "Volunteer" && (
        <div className="history-section">
          <button
            className={`accordion-toggle ${showHistory ? "active" : ""}`}
            onClick={() => setShowHistory(!showHistory)}
          >
            Historial de Eventos{" "}
            <span className="accordion-arrow">{showHistory ? "▲" : "▼"}</span>
          </button>

          {showHistory && (
            <div className="accordion-content">
              {myActivity.length === 0 ? (
                <p className="no-events">Aún no has participado en eventos.</p>
              ) : (
                <div className="events-list">
                  {myActivity.map((event) => {
                    const passed = isEventPassed(event.date, event.time);
                    return (
                      <div key={event._id} className="history-card">
                        <div className="history-info">
                          <h4>{event.title}</h4>
                          <p>
                            <strong>Fecha:</strong>{" "}
                            {formatChileDate(event.date)}
                          </p>
                          <p>
                            <strong>Estado:</strong>{" "}
                            <span
                              className={
                                passed ? "status-passed" : "status-future"
                              }
                            >
                              {passed ? " Finalizado" : " Próximo"}
                            </span>
                          </p>
                        </div>
                        <div className="history-action">
                          <button
                            className={`btn-download ${
                              passed ? "btn-active" : "btn-disabled"
                            }`}
                            onClick={() => handleDownloadCertificate(event._id)}
                            disabled={!passed}
                          >
                            {passed
                              ? "Descargar Certificado 📥"
                              : "Pendiente 🔒"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {userData.role === "Coordinator" && (
        <div className="history-section">
          <h3 className="coord-title">Gestiones Realizadas</h3>
          {myActivity.map((req) => (
            <div key={req._id} className="history-card coord-card">
              <p>
                <strong>Solicitud:</strong> {req.title}
              </p>
              <span className={`status-badge-small ${req.status}`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
