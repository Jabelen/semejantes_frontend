import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import { formatChileDate } from "../../utils/dateHelper";
import { useNotification } from "../../context/NotificationContext";
import ConfirmModal from "../../components/ConfirmModal";
import "./DashboardComponents.css";

export default function EventsManager({ userRole }) {
  const { addNotification } = useNotification();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 1,
    place: "",
    requirements: "",
  });
  const [file, setFile] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await apiRequest("/api/events");
      const sorted = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEvents(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (event) => {
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
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewClick = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 1,
      place: "",
      requirements: "",
    });
    setFile(null);
    setShowForm(!showForm);
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

      setShowForm(false);
      setEditingId(null);
      loadEvents();
    } catch (err) {
      addNotification(err.message, "error");
    }
  };

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
    setModalOpen(true);
  };

  const executeDelete = async () => {
    if (!eventToDelete) return;
    try {
      await apiRequest(`/api/events/${eventToDelete}`, "DELETE");
      addNotification("Evento eliminado correctamente", "success");
      loadEvents();
    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      setModalOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className="module-container">
      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={executeDelete}
        title="Eliminar Evento"
        message="¿Estás seguro de que deseas eliminar este evento permanentemente? Esta acción no se puede deshacer."
      />

      {/* --- HEADER CORREGIDO: Bloque estándar alineado a la izquierda --- */}
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 10px 0", padding: "0" }}>Gestión de Eventos</h2>
        {userRole === "Coordinator" && (
          <button 
            className="btn-primary" 
            onClick={handleNewClick}
            style={{ marginLeft: "0" }} // Forzamos margen izquierdo 0
          >
            {showForm && !editingId ? "Cancelar" : "+ Nuevo Evento"}
          </button>
        )}
      </div>
      {/* ------------------------------------------------------------------ */}

      {showForm && (
        <div className="form-container">
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Editar Evento" : "Nuevo Evento"}
          </h3>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <input
              placeholder="Título"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <div className="row">
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Duración (hrs)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
            <input
              placeholder="Lugar"
              value={formData.place}
              onChange={(e) =>
                setFormData({ ...formData, place: e.target.value })
              }
            />
            <input
              placeholder="Requisitos"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
            />

            <div style={{ margin: "10px 0" }}>
              <label style={{ fontSize: "0.9rem", color: "#666" }}>
                Imagen (Deja vacío para mantener la actual):
              </label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <div className="row">
              <button type="submit" className="btn-success">
                {editingId ? "Guardar Cambios" : "Publicar"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {events.map((ev) => (
          <div key={ev._id} className="dash-card">
            {ev.images?.[0] && (
              <img src={ev.images[0]} alt={ev.title} className="card-img" />
            )}
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <small>
              📅 {formatChileDate(ev.date)} | 📍 {ev.place}
            </small>

            {userRole === "Coordinator" && (
              <div className="card-actions">
                <button
                  onClick={() => handleEditClick(ev)}
                  className="btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Editar ✏️
                </button>
                <button
                  onClick={() => handleDeleteClick(ev._id)}
                  className="btn-danger"
                >
                  Eliminar 🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}