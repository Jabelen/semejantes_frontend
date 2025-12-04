import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import EventCard from "../components/EventCard.jsx";
import FloatingButton from "../components/FloatingButton";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    place: "",
    requirements: "",
  });
  const [file, setFile] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      if (data.status === "success") {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  const handleJoin = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión para participar");

    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}/participate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        alert("¡Te has inscrito correctamente!");
        fetchEvents(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error al inscribirse");
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Evento eliminado");
        fetchEvents();
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) {
      data.append("photos", file);
    }

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        alert("Evento creado con éxito");
        setShowModal(false);
        fetchEvents();
        setFormData({
          title: "", description: "", date: "", time: "", duration: "", place: "", requirements: "",
        });
        setFile(null);
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="events-page">
      <Header />

      {/* NUEVO HERO SECTION */}
      <div className="events-hero">
        <h1>Próximos Encuentros</h1>
        <p>"Donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos."</p>
      </div>

      <div className="events-container">
        
        {/* Botón solo para Coordinadores */}
        {user?.role === "Coordinator" && (
          <button className="create-btn" onClick={() => setShowModal(true)}>
            + Crear Nuevo Evento
          </button>
        )}

        <div className="events-list">
          {events.length === 0 ? (
            <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#666'}}>
              No hay eventos programados por el momento.
            </p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userRole={user?.role}
                userId={user?.id}
                onJoin={handleJoin}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* MODAL DE CREACIÓN DE EVENTO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nuevo Evento</h2>
            <form onSubmit={handleCreateSubmit}>
              <input name="title" placeholder="Título del Evento" onChange={handleChange} required />
              <textarea name="description" placeholder="¿De qué trata el evento?" rows="3" onChange={handleChange} required />
              
              <div className="form-row" style={{display: 'flex', gap: '10px'}}>
                <input type="date" name="date" onChange={handleChange} required style={{flex: 1}}/>
                <input type="time" name="time" onChange={handleChange} required style={{flex: 1}}/>
              </div>

              <div className="form-row" style={{display: 'flex', gap: '10px'}}>
                 <input type="number" name="duration" placeholder="Duración (hrs)" onChange={handleChange} required style={{flex: 1}}/>
                 <input name="place" placeholder="Ubicación / Dirección" onChange={handleChange} required style={{flex: 2}}/>
              </div>

              <input name="requirements" placeholder="Requisitos (Opcional)" onChange={handleChange} />

              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555'}}>Imagen de portada:</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingButton />
    </div>
  );
}