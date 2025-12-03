import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";

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
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await apiRequest("/api/donations", "POST", newItem);
      loadItems();
      setNewItem({ itemName: "", type: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeliver = async () => {
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
    <div className="module-container">
      <h2>Inventario y Donaciones</h2>

      {userRole === "Coordinator" && (
        <div className="inventory-controls">
          <input
            placeholder="Nombre del ítem (ej: Silla #10)"
            value={newItem.itemName}
            onChange={(e) =>
              setNewItem({ ...newItem, itemName: e.target.value })
            }
          />
          <input
            placeholder="Tipo (ej: Movilidad)"
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          />
          <button onClick={handleCreate} className="btn-primary">
            Agregar al Inventario
          </button>
        </div>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Ítem</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.type}</td>
              <td>
                {item.available ? (
                  <span className="badge active">Disponible</span>
                ) : (
                  <span className="badge rejected">
                    Entregado a {item.deliveredTo}
                  </span>
                )}
              </td>
              <td>
                {userRole === "Coordinator" &&
                  item.available &&
                  (delivery.id === item._id ? (
                    <div className="delivery-input">
                      <input
                        placeholder="Nombre Beneficiario"
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            deliveredTo: e.target.value,
                          })
                        }
                      />
                      <button onClick={handleDeliver}>Confirmar</button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setDelivery({ id: item._id, deliveredTo: "" })
                      }
                      className="btn-sm"
                    >
                      Entregar
                    </button>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
