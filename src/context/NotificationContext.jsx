import { createContext, useState, useContext, useCallback } from "react";
import "../components/Notification.css"; // Estilo que crearemos abajo

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Función para agregar notificación
  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto eliminar después de 3 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-toast ${n.type}`}
            onClick={() => removeNotification(n.id)}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};