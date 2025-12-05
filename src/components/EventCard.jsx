import "./EventCard.css";
import { formatChileDate } from "../utils/dateHelper";

export default function EventCard({
  event,
  userRole,
  onJoin,
  onLeave,
  onDelete,
  onEdit,
  userId,
}) {
  const isParticipating =
    event.participantes && event.participantes.includes(userId);

  // --- FUNCIÓN CORREGIDA PARA VALIDAR FECHAS ---
  const isEventPassed = (dateString, timeString) => {
    if (!dateString) return false;
    const now = new Date();
    let eventDate;

    // Caso 1: Formato ISO estándar del backend (YYYY-MM-DD)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      const cleanDate = dateString.substring(0, 10);
      const [year, month, day] = cleanDate.split("-").map(Number);
      eventDate = new Date(year, month - 1, day);
    }
    // Caso 2: Formato Chileno visual (DD-MM-YYYY) - Por si acaso llega así
    else if (dateString.match(/^\d{2}-\d{2}-\d{4}/)) {
      const [day, month, year] = dateString.split("-").map(Number);
      eventDate = new Date(year, month - 1, day);
    }
    // Caso 3: Fallback
    else {
      eventDate = new Date(dateString);
    }

    // Ajustar Hora
    if (timeString && timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      eventDate.setHours(23, 59, 59, 999);
    }

    return now > eventDate;
  };
  // -----------------------------------------------

  const hasPassed = isEventPassed(event.date, event.time);

  const imageUrl =
    event.images && event.images.length > 0
      ? event.images[0]
      : "https://via.placeholder.com/400x300?text=Sin+Imagen";

  return (
    <div className={`card-container ${hasPassed ? "card-finished" : ""}`}>
      <div className="left-section">
        <div>
          <h3 className="event-title">{event.title}</h3>
          <p className="event-desc">{event.description}</p>

          <div className="event-details">
            <div className="detail-item">
              📅 <strong>Fecha:</strong> {formatChileDate(event.date)}
            </div>
            <div className="detail-item">
              ⏰ <strong>Hora:</strong> {event.time}
            </div>
            <div className="detail-item">
              📍 <strong>Lugar:</strong> {event.place}
            </div>
            <div className="detail-item">
              ⏳ <strong>Duración:</strong> {event.duration} hrs
            </div>
            <div className="detail-item">
              📋 <strong>Requisitos:</strong> {event.requirements || "Ninguno"}
            </div>
          </div>
        </div>

        <div className="card-actions">
          {/* VOLUNTARIO */}
          {userRole === "Volunteer" && (
            <>
              {hasPassed ? (
                <button className="btn-inscribir disabled-passed" disabled>
                  Evento Finalizado 🔒
                </button>
              ) : isParticipating ? (
                <button
                  className="btn-leave"
                  onClick={() => onLeave(event._id)}
                >
                  Cancelar Inscripción ❌
                </button>
              ) : (
                <button
                  className="btn-inscribir"
                  onClick={() => onJoin(event._id)}
                >
                  Inscríbete
                </button>
              )}
            </>
          )}

          {/* COORDINADOR */}
          {userRole === "Coordinator" && (
            <div className="coord-buttons">
              <button className="btn-edit" onClick={() => onEdit(event)}>
                Editar ✏️
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(event._id)}
              >
                Eliminar 🗑️
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="right-section">
        <img
          src={imageUrl}
          alt={event.title}
          className={`image ${hasPassed ? "img-grayscale" : ""}`}
        />
        {hasPassed && (
          <div className="finished-overlay">
            <span>FINALIZADO</span>
          </div>
        )}
        <div className="diagonal"></div>
      </div>
    </div>
  );
}
