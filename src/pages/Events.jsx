import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import EventCard from "../components/EventCard.jsx";
import FloatingButton from "../components/FloatingButton";
import ConfirmModal from "../components/ConfirmModal";
import { apiRequest } from "../utils/api";
import { useNotification } from "../context/NotificationContext";
import "./Events.css";

export default function Events() {
  const { addNotification } = useNotification();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState({ type: null, id: null });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiRequest("/api/events");
      const sorted = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEvents(sorted);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
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

  const openEditModal = (event) => {
    setEditingId(event._id);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("photos", file);

    try {
      if (editingId) {
        await apiRequest(`/api/events/${editingId}`, "PUT", data, true);
        addNotification("Evento actualizado correctamente", "success");
      } else {
        await apiRequest("/api/events", "POST", data, true);
        addNotification("Evento creado correctamente", "success");
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      addNotification(error.message, "error");
    }
  };

  const handleJoin = async (id) => {
    try {
      await apiRequest(`/api/events/${id}/participate`, "PATCH");
      addNotification("¡Te has inscrito exitosamente!", "success");
      fetchEvents();
    } catch (error) {
      addNotification(error.message, "error");
    }
  };

  const requestLeave = (id) => {
    setActionData({ type: "leave", id });
    setConfirmOpen(true);
  };

  const requestDelete = (id) => {
    setActionData({ type: "delete", id });
    setConfirmOpen(true);
  };

  const executeAction = async () => {
    const { type, id } = actionData;
    try {
      if (type === "leave") {
        await apiRequest(`/api/events/${id}/leave`, "PATCH");
        addNotification("Inscripción cancelada", "info");
      } else if (type === "delete") {
        await apiRequest(`/api/events/${id}`, "DELETE");
        addNotification("Evento eliminado", "success");
      }
      fetchEvents();
    } catch (error) {
      addNotification(error.message, "error");
    } finally {
      setConfirmOpen(false);
      setActionData({ type: null, id: null });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="events-page">
      <Header />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeAction}
        title={actionData.type === "delete" ? "Eliminar Evento" : "Cancelar Inscripción"}
        message={
          actionData.type === "delete" 
            ? "¿Estás seguro de que deseas eliminar este evento? No se podrá recuperar." 
            : "¿Seguro que quieres abandonar este evento? Perderás tu cupo."
        }
      />

      <div className="events-container">
        
        {/* --- HEADER CORREGIDO --- */}
        <div style={{ textAlign: "left", marginBottom: "25px" }}>
            <h1 style={{ margin: "0 0 10px 0", padding: "0" }}>
              {user?.role === "Coordinator" ? "Gestión de Eventos" : "Próximos Eventos"}
            </h1>

            {user?.role === "Coordinator" && (
              <button 
                className="create-btn" 
                onClick={openCreateModal}
                style={{ marginLeft: "0" }} // Forzar alineación
              >
                + Crear Nuevo Evento
              </button>
            )}
        </div>
        {/* ------------------------ */}

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
                onLeave={requestLeave}
                onDelete={requestDelete}
                onEdit={openEditModal}
              />
            ))
          )}
        </div>
      </div>

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