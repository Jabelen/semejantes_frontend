import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import { useNotification } from "../../context/NotificationContext";
import ConfirmModal from "../ConfirmModal";
import "./DonationsManager.css";

export default function DonationsManager({ userRole }) {
  const { addNotification } = useNotification();
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    itemName: "",
    type: "",
    donorName: "",
    donorRut: "",
    donorPhone: "",
  });

  const [delivery, setDelivery] = useState({
    id: null,
    beneficiaryName: "",
    beneficiaryRut: "",
    beneficiaryPhone: "",
  });

  // Estado para el Modal de Confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await apiRequest("/api/donations");
      const sorted = res.data.sort(
        (a, b) => Number(b.available) - Number(a.available)
      );
      setItems(sorted);
    } catch (err) {
      console.error(err);
      addNotification("Error al cargar donaciones", "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.type || !newItem.donorName) {
      addNotification(
        "Por favor completa los campos obligatorios (Ítem, Tipo y Nombre Donante)",
        "info"
      );
      return;
    }

    try {
      await apiRequest("/api/donations", "POST", newItem);
      addNotification("Donación registrada exitosamente", "success");
      loadItems();
      setNewItem({
        itemName: "",
        type: "",
        donorName: "",
        donorRut: "",
        donorPhone: "",
      });
    } catch (err) {
      addNotification(err.message, "error");
    }
  };

  const handleDeliver = async () => {
    if (!delivery.beneficiaryName) {
      addNotification("El nombre del beneficiario es obligatorio", "info");
      return;
    }

    try {
      const { id, ...dataToSend } = delivery;
      await apiRequest(`/api/donations/${id}`, "PUT", dataToSend);
      addNotification("Entrega registrada correctamente", "success");
      loadItems();
      setDelivery({
        id: null,
        beneficiaryName: "",
        beneficiaryRut: "",
        beneficiaryPhone: "",
      });
    } catch (err) {
      addNotification("Error al entregar: " + err.message, "error");
    }
  };

  // Paso 1: Abrir Modal
  const requestDelete = (id) => {
    setItemToDelete(id);
    setModalOpen(true);
  };

  // Paso 2: Ejecutar eliminación
  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      await apiRequest(`/api/donations/${itemToDelete}`, "DELETE");
      addNotification("Donación eliminada correctamente", "success");
      loadItems();
    } catch (err) {
      addNotification("Error al eliminar: " + err.message, "error");
    } finally {
      setModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="donations-manager-container">
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeDelete}
        title="Eliminar Donación"
        message="¿Estás seguro de eliminar esta donación del registro? Esta acción no se puede deshacer."
      />

      <h2 className="donations-title">Inventario y Donaciones</h2>
      <p className="donations-subtitle">
        Gestiona los recursos disponibles para la comunidad
      </p>

      {/* --- PANEL DE CONTROL (Solo Coordinador) --- */}
      {userRole === "Coordinator" && (
        <div className="inventory-controls-card">
          <h3>➕ Agregar Nueva Donación</h3>
          <form className="controls-form" onSubmit={handleCreate}>
            <div className="form-row">
              <input
                className="control-input"
                placeholder="Nombre del ítem (Ej: Silla de Ruedas)*"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemName: e.target.value })
                }
                required
              />
              <input
                className="control-input"
                placeholder="Tipo (Ej: Movilidad)*"
                value={newItem.type}
                onChange={(e) =>
                  setNewItem({ ...newItem, type: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <input
                className="control-input"
                placeholder="Nombre Donante*"
                value={newItem.donorName}
                onChange={(e) =>
                  setNewItem({ ...newItem, donorName: e.target.value })
                }
                required
              />
              <input
                className="control-input"
                placeholder="RUT Donante"
                value={newItem.donorRut}
                onChange={(e) =>
                  setNewItem({ ...newItem, donorRut: e.target.value })
                }
              />
              <input
                className="control-input"
                placeholder="Teléfono Donante"
                value={newItem.donorPhone}
                onChange={(e) =>
                  setNewItem({ ...newItem, donorPhone: e.target.value })
                }
              />
              <button type="submit" className="btn-add">
                Agregar
              </button>
            </div>
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
              className={`donation-item-card ${
                item.available ? "available" : "delivered"
              }`}
            >
              <div className="card-main-content">
                <div className="item-header">
                  <span className="item-icon">
                    {item.type.toLowerCase().includes("silla")
                      ? "🦽"
                      : item.type.toLowerCase().includes("alimento")
                      ? "🥫"
                      : "🎁"}
                  </span>
                  <span
                    className={`status-badge ${
                      item.available ? "available" : "delivered"
                    }`}
                  >
                    {item.available ? "Disponible" : "Entregado"}
                  </span>
                </div>

                <h4 className="item-name">{item.itemName}</h4>
                <div className="item-type">{item.type}</div>

                {/* --- NUEVA SECCIÓN DE DATOS DEL DONANTE --- */}
                {item.donorName && (
                  <div className="donor-info-block">
                    <span className="item-donor">
                      Donado por: {item.donorName}
                    </span>
                    {/* Mostrar detalles de contacto SOLO al coordinador */}
                    {userRole === "Coordinator" &&
                      (item.donorRut || item.donorPhone) && (
                        <div className="donor-details-text">
                          {item.donorRut && (
                            <span>RUT: {item.donorRut} • </span>
                          )}
                          {item.donorPhone && (
                            <span>Tel: {item.donorPhone}</span>
                          )}
                        </div>
                      )}
                  </div>
                )}

                {/* DETALLES DEL BENEFICIARIO (Cuando ya no está disponible) */}
                {!item.available && (
                  <div className="beneficiary-details-box">
                    <strong style={{ color: "#1a3c6d" }}>Entregado a:</strong>
                    <div className="beneficiary-name">
                      {item.beneficiaryName || item.deliveredTo || "Sin nombre"}
                    </div>
                    {(item.beneficiaryRut || item.beneficiaryPhone) && (
                      <div className="beneficiary-contact">
                        {item.beneficiaryRut && (
                          <span>
                            RUT: {item.beneficiaryRut}
                            <br />
                          </span>
                        )}
                        {item.beneficiaryPhone && (
                          <span>Tel: {item.beneficiaryPhone}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECCIÓN DE ACCIONES (Coordinador) */}
              {userRole === "Coordinator" && (
                <div className="delivery-section">
                  {item.available ? (
                    delivery.id === item._id ? (
                      <div className="delivery-form-stack">
                        <input
                          className="input-sm"
                          placeholder="Nombre Beneficiario*"
                          autoFocus
                          value={delivery.beneficiaryName}
                          onChange={(e) =>
                            setDelivery({
                              ...delivery,
                              beneficiaryName: e.target.value,
                            })
                          }
                        />
                        <div className="delivery-row">
                          <input
                            className="input-sm"
                            placeholder="RUT"
                            value={delivery.beneficiaryRut}
                            onChange={(e) =>
                              setDelivery({
                                ...delivery,
                                beneficiaryRut: e.target.value,
                              })
                            }
                          />
                          <input
                            className="input-sm"
                            placeholder="Teléfono"
                            value={delivery.beneficiaryPhone}
                            onChange={(e) =>
                              setDelivery({
                                ...delivery,
                                beneficiaryPhone: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="delivery-actions">
                          <button
                            className="btn-confirm"
                            onClick={handleDeliver}
                            style={{ flex: 1 }}
                          >
                            Confirmar
                          </button>
                          <button
                            className="btn-cancel"
                            style={{ width: "40px" }}
                            onClick={() =>
                              setDelivery({
                                id: null,
                                beneficiaryName: "",
                                beneficiaryRut: "",
                                beneficiaryPhone: "",
                              })
                            }
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() =>
                            setDelivery({
                              id: item._id,
                              beneficiaryName: "",
                              beneficiaryRut: "",
                              beneficiaryPhone: "",
                            })
                          }
                          className="btn-deliver-toggle"
                          style={{ flex: 1 }}
                        >
                          Entregar
                        </button>
                        <button
                          onClick={() => requestDelete(item._id)}
                          className="btn-cancel"
                          title="Eliminar Donación"
                        >
                          🗑️
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => requestDelete(item._id)}
                      className="btn-cancel"
                      style={{ width: "100%", marginTop: "10px" }}
                    >
                      Eliminar Registro
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