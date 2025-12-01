import "./EventCard.css";

export default function EventCard({event, direction, hr, mn, rutaImg}) {
  return (
    <div className="card-container">

      <div className="left-section">
        <div>
          <p className="text">Evento: {event} </p>
          <p className="text">Lugar: {direction} </p>
          <p className="text">Hora: {hr}:{mn}</p>
        </div>

        <button className="btn-inscribir">Inscríbete</button>
      </div>

      <div className="right-section">
        <img
          src={rutaImg}
          alt="Imagen del evento"
          className="image"
        />
        <div className="diagonal"></div>
      </div>

    </div>
  );
}
