import "./EventCard.css";

export default function EventCard({
  event,
  userRole,
  onJoin,
  onDelete,
  userId,
}) {
  // Verificar si el usuario ya está inscrito (si su ID está en la lista de participantes)
  const isParticipating =
    event.participantes && event.participantes.includes(userId);

  // Imagen por defecto si el evento no tiene fotos
  const imageUrl =
    event.images && event.images.length > 0
      ? event.images[0]
      : "https://via.placeholder.com/400x300?text=Sin+Imagen";

  return (
    <div className="card-container">
      <div className="left-section">
        <div>
          <h3 className="event-title">{event.title}</h3>
          <p className="event-desc">{event.description}</p>

          <div className="event-details">
            <p>
              <strong>📅 Fecha:</strong> {event.date}
            </p>
            <p>
              <strong>⏰ Hora:</strong> {event.time}
            </p>
            <p>
              <strong>📍 Lugar:</strong> {event.place}
            </p>
            <p>
              <strong>⏳ Duración:</strong> {event.duration} hrs
            </p>
            <p>
              <strong>📋 Requisitos:</strong> {event.requirements || "Ninguno"}
            </p>
          </div>
        </div>

        <div className="card-actions">
          {/* Botón para VOLUNTARIOS */}
          {userRole === "Volunteer" && (
            <button
              className={`btn-inscribir ${isParticipating ? "disabled" : ""}`}
              onClick={() => !isParticipating && onJoin(event._id)}
              disabled={isParticipating}
            >
              {isParticipating ? "Ya estás inscrito ✅" : "Inscríbete"}
            </button>
          )}

          {/* Botón para COORDINADORES */}
          {userRole === "Coordinator" && (
            <button className="btn-delete" onClick={() => onDelete(event._id)}>
              Eliminar Evento 🗑️
            </button>
          )}
        </div>
      </div>

      <div className="right-section">
        <img src={imageUrl} alt={event.title} className="image" />
        <div className="diagonal"></div>
      </div>
    </div>
  );
}
