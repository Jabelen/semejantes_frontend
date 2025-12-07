import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import "./DonationsManager.css"; // Importar el nuevo CSS

export default function DonationsManager({ userRole }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemName: "", type: "" });
  const [delivery, setDelivery] = useState({ id: null, deliveredTo: "" });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await apiRequest("/api/donations");
      // Ordenar: Disponibles primero
      const sorted = res.data.sort((a, b) => Number(b.available) - Number(a.available));
      setItems(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault(); // Prevenir recarga si está en form
    if (!newItem.itemName || !newItem.type) return;
    
    try {
      await apiRequest("/api/donations", "POST", newItem);
      loadItems();
      setNewItem({ itemName: "", type: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeliver = async () => {
    if (!delivery.deliveredTo) return;
    try {
      await apiRequest(`/api/donations/${delivery.id}`, "PUT", {
        deliveredTo: delivery.deliveredTo,
      });
      loadItems();
      setDelivery({ id: null, deliveredTo: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="donations-manager-container">
      <h2 className="donations-title">Inventario y Donaciones</h2>
      <p className="donations-subtitle">Gestiona los recursos disponibles para la comunidad</p>

      {/* --- PANEL DE CONTROL (Solo Coordinador) --- */}
      {userRole === "Coordinator" && (
        <div className="inventory-controls-card">
          <h3>➕ Agregar Nuevo Ítem</h3>
          <form className="controls-form" onSubmit={handleCreate}>
            <input
              className="control-input"
              placeholder="Nombre del ítem (Ej: Silla de Ruedas #4)"
              value={newItem.itemName}
              onChange={(e) =>
                setNewItem({ ...newItem, itemName: e.target.value })
              }
              required
            />
            <input
              className="control-input"
              placeholder="Tipo (Ej: Movilidad, Alimento)"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              required
            />
            <button type="submit" className="btn-add">
              Agregar
            </button>
          </form>
        </div>
      )}

      {/* --- GRILLA DE TARJETAS --- */}
      {items.length === 0 ? (
        <p className="empty-msg">El inventario está vacío actualmente.</p>
      ) : (
        <div className="inventory-grid">
          {items.map((item) => (
            <div 
              key={item._id} 
              className={`donation-item-card ${item.available ? 'available' : 'delivered'}`}
            >
              <div className="card-main-content">
                <div className="item-header">
                  <span className="item-icon">
                    {item.type.toLowerCase().includes("silla") ? "🦽" : 
                     item.type.toLowerCase().includes("alimento") ? "🥫" : "🎁"}
                  </span>
                  <span className={`status-badge ${item.available ? 'available' : 'delivered'}`}>
                    {item.available ? "Disponible" : "Entregado"}
                  </span>
                </div>
                
                <h4 className="item-name">{item.itemName}</h4>
                <div className="item-type">{item.type}</div>

                {!item.available && (
                  <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "10px" }}>
                    <strong>Entregado a:</strong> <br/> {item.deliveredTo}
                  </div>
                )}
              </div>

              {/* Sección de Acción (Solo Coordinador y si está disponible) */}
              {userRole === "Coordinator" && item.available && (
                <div className="delivery-section">
                  {delivery.id === item._id ? (
                    <div className="delivery-input-group">
                      <input
                        className="input-sm"
                        placeholder="Nombre Beneficiario"
                        autoFocus
                        value={delivery.deliveredTo}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            deliveredTo: e.target.value,
                          })
                        }
                      />
                      <button className="btn-confirm" onClick={handleDeliver}>
                        ✓
                      </button>
                      <button 
                        className="btn-confirm" 
                        style={{background: "#dc3545"}}
                        onClick={() => setDelivery({ id: null, deliveredTo: "" })}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDelivery({ id: item._id, deliveredTo: "" })}
                      className="btn-deliver-toggle"
                    >
                      Registrar Entrega
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}