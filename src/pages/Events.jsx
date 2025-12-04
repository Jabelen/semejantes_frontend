import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import EventCard from "../components/EventCard.jsx";
import FloatingButton from "../components/FloatingButton";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Estado para saber si estamos editando
  const [editingId, setEditingId] = useState(null);

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
        const sorted = data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(sorted);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --- ABRIR MODAL PARA CREAR ---
  const openCreateModal = () => {
    setEditingId(null); // Limpiamos ID
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
    setShowModal(true);
  };

  // --- ABRIR MODAL PARA EDITAR (NUEVO) ---
  const openEditModal = (event) => {
    setEditingId(event._id); // Guardamos el ID que estamos editando
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      place: event.place,
      requirements: event.requirements || "",
    });
    setFile(null);
    setShowModal(true);
  };

  // --- ENVIAR FORMULARIO (CREAR O EDITAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("photos", file);

    // Decidimos si es POST (Crear) o PUT (Editar)
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `/api/events/${editingId}` : "/api/events";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        alert(editingId ? "Evento actualizado" : "Evento creado");
        setShowModal(false);
        fetchEvents();
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  // ... (Tus otras funciones handleJoin, handleLeave, handleDelete siguen igual) ...
  const handleJoin = async (id) => {
    /* Tu código de unirse */
  };
  const handleLeave = async (id) => {
    /* Tu código de salirse */
  };
  const handleDelete = async (id) => {
    /* Tu código de borrar */
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="events-page">
      <Header />
      <div className="events-container">
        <h1>
          {user?.role === "Coordinator"
            ? "Gestión de Eventos"
            : "Próximos Eventos"}
        </h1>

        {user?.role === "Coordinator" && (
          <button className="create-btn" onClick={openCreateModal}>
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
                userId={user?.id}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onDelete={handleDelete}
                onEdit={openEditModal} /* <--- PASAMOS LA FUNCIÓN */
              />
            ))
          )}
        </div>
      </div>

      {/* MODAL REUTILIZABLE */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingId ? "Editar Evento" : "Nuevo Evento"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="form-row">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="number"
                name="duration"
                placeholder="Duración"
                value={formData.duration}
                onChange={handleChange}
                required
              />
              <input
                name="place"
                placeholder="Lugar"
                value={formData.place}
                onChange={handleChange}
                required
              />
              <input
                name="requirements"
                placeholder="Requisitos"
                value={formData.requirements}
                onChange={handleChange}
              />

              <label style={{ marginTop: "10px", display: "block" }}>
                Imagen {editingId && "(Opcional)"}:
              </label>
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
                  {editingId ? "Guardar Cambios" : "Publicar"}
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
