import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import EventCard from "../components/EventCard.jsx";
import FloatingButton from "../components/FloatingButton";
import "./Events.css"; // Crearemos este CSS en el paso 3

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
    // 1. Obtener usuario logueado
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // 2. Cargar eventos
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

  // --- FUNCIÓN: VOLUNTARIO SE INSCRIBE ---
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
        fetchEvents(); // Recargar para ver el cambio
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error al inscribirse");
    }
  };

  // --- FUNCIÓN: COORDINADOR ELIMINA ---
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

  // --- FUNCIÓN: COORDINADOR CREA EVENTO (MULTIPART) ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Usamos FormData para enviar archivos
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    if (file) {
      data.append("photos", file); // 'photos' debe coincidir con el backend
    }

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data, // No poner Content-Type manual al usar FormData
      });

      if (res.ok) {
        alert("Evento creado con éxito");
        setShowModal(false);
        fetchEvents();
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          duration: "",
          place: "",
          requirements: "",
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

      <div className="events-container">
        <h1>Próximos Eventos</h1>

        {/* Botón solo para Coordinadores */}
        {user?.role === "Coordinator" && (
          <button className="create-btn" onClick={() => setShowModal(true)}>
            + Crear Nuevo Evento
          </button>
        )}

        <div className="events-list">
          {events.length === 0 ? (
            <p>No hay eventos programados.</p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userRole={user?.role}
                userId={user?.id} // ID numérico de SQL
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
              <input
                name="title"
                placeholder="Título"
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descripción"
                onChange={handleChange}
                required
              />
              <div className="form-row">
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="time"
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="number"
                name="duration"
                placeholder="Duración (horas)"
                onChange={handleChange}
                required
              />
              <input
                name="place"
                placeholder="Lugar / Dirección"
                onChange={handleChange}
                required
              />
              <input
                name="requirements"
                placeholder="Requisitos (opcional)"
                onChange={handleChange}
              />

              <label>Imagen del Evento:</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
              />

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Publicar Evento
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
