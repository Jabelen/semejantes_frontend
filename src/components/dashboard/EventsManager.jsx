import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import { formatChileDate } from "../../utils/dateHelper"; // <--- IMPORTAR
import "./DashboardComponents.css";

export default function EventsManager({ userRole }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await apiRequest("/api/events");
      setEvents(res.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("photos", file);

    try {
      await apiRequest("/api/events", "POST", data, true);
      alert("Evento creado!");
      setShowForm(false);
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar?")) return;
    try {
      await apiRequest(`/api/events/${id}`, "DELETE");
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoin = async (id) => {
    try {
      await apiRequest(`/api/events/${id}/participate`, "PATCH");
      alert("Inscrito!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="module-container">
      <h2>Gestión de Eventos</h2>

      {userRole === "Coordinator" && (
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Nuevo Evento"}
        </button>
      )}

      {showForm && (
        <form className="dashboard-form" onSubmit={handleCreate}>
          <input
            placeholder="Título"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Descripción"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <div className="row">
            <input
              type="date"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
            <input
              type="time"
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Duración"
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </div>
          <input
            placeholder="Lugar"
            onChange={(e) =>
              setFormData({ ...formData, place: e.target.value })
            }
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" className="btn-success">
            Publicar
          </button>
        </form>
      )}

      <div className="cards-grid">
        {events.map((ev) => (
          <div key={ev._id} className="dash-card">
            {ev.images?.[0] && (
              <img src={ev.images[0]} alt={ev.title} className="card-img" />
            )}
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            {/* FECHA CON FORMATO CHILENO */}
            <small>
              📅 {formatChileDate(ev.date)} | 📍 {ev.place}
            </small>
            <div className="card-actions">
              {userRole === "Volunteer" && (
                <button onClick={() => handleJoin(ev._id)} className="btn-join">
                  Participar
                </button>
              )}
              {userRole === "Coordinator" && (
                <button
                  onClick={() => handleDelete(ev._id)}
                  className="btn-danger"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
