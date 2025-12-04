import "./EventCard.css";
import { formatChileDate } from "../utils/dateHelper";

export default function EventCard({
  event,
  userRole,
  onJoin,
  onDelete,
  userId,
}) {
  const isParticipating =
    event.participantes && event.participantes.includes(userId);

  // Lógica para verificar si el evento pasó
  const isEventPassed = (dateString, timeString) => {
    if (!dateString) return false;
    const now = new Date();

    // 1. Intentar crear la fecha base
    let eventDate = new Date(dateString);

    // Validación de seguridad: si la fecha es inválida, no bloqueamos (asumimos futuro)
    if (isNaN(eventDate.getTime())) {
      console.warn("Fecha inválida recibida:", dateString);
      return false;
    }

    // 2. Ajuste de Zona Horaria:
    // Extraemos los componentes UTC (que es como Mongo guarda) y los usamos
    // para crear una fecha LOCAL. Esto corrige el desfase de -4 horas.
    eventDate = new Date(
      eventDate.getUTCFullYear(),
      eventDate.getUTCMonth(),
      eventDate.getUTCDate()
    );

    // 3. Configurar hora de término
    if (timeString && timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      // Si no hay hora, se considera activo hasta el final del día
      eventDate.setHours(23, 59, 59, 999);
    }

    // Debug (Puedes borrarlo si te molesta)
    // console.log(`Evento: ${event.title} | Cierra: ${eventDate.toLocaleString()} | Ahora: ${now.toLocaleString()} | Pasó?: ${now > eventDate}`);

    return now > eventDate;
  };

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
          {userRole === "Volunteer" && (
            <button
              className={`btn-inscribir ${
                hasPassed
                  ? "disabled-passed"
                  : isParticipating
                  ? "disabled-joined"
                  : ""
              }`}
              onClick={() =>
                !isParticipating && !hasPassed && onJoin(event._id)
              }
              disabled={isParticipating || hasPassed}
            >
              {hasPassed
                ? "Finalizado 🔒"
                : isParticipating
                ? "Ya estás inscrito ✅"
                : "Inscríbete"}
            </button>
          )}

          {userRole === "Coordinator" && (
            <button className="btn-delete" onClick={() => onDelete(event._id)}>
              Eliminar Evento 🗑️
            </button>
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
