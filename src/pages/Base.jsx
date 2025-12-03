import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { slide as Menu } from "react-burger-menu";
import Header from "../components/Header";
import Profile from "./Profile";

// Importamos los módulos
import DashboardHome from "../components/dashboard/DashboardHome"; // <--- IMPORTAR
import EventsManager from "../components/dashboard/EventsManager";
import RequestsManager from "../components/dashboard/RequestsManager";
import DonationsManager from "../components/dashboard/DonationsManager";

import "../components/BurgerMenu.css";
import "./Base.css";

export default function Base() {
  const [view, setView] = useState("home"); // <--- CAMBIAR DEFAULT A 'home'
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) navigate("/login");
    setUser(storedUser);
  }, [navigate]);

  if (!user) return null;

  return (
    <div id="outer-container">
      <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <div className="menu-header">Hola, {user.username}</div>
        {/* Agregamos botón Inicio al menú */}
        <a className="menu-item" onClick={() => setView("home")}>
          🏠 Inicio
        </a>
        <a className="menu-item" onClick={() => setView("profile")}>
          👤 Mi Perfil
        </a>
        <a className="menu-item" onClick={() => setView("events")}>
          📅 Eventos
        </a>
        <a className="menu-item" onClick={() => setView("requests")}>
          📝 Solicitudes (Beneficiarios)
        </a>
        <a className="menu-item" onClick={() => setView("donations")}>
          🎁 Donaciones (Recursos)
        </a>
        {user.role === "Coordinator" && (
          <a className="menu-item" onClick={() => setView("reports")}>
            📊 Reportes
          </a>
        )}
        <a
          className="menu-item logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Cerrar Sesión
        </a>
      </Menu>

      <main id="page-wrap">
        <Header />
        <div className="dashboard-content">
          {/* Pasamos setView a DashboardHome para que los botones funcionen */}
          {view === "home" && (
            <DashboardHome setView={setView} userRole={user.role} />
          )}

          {view === "profile" && <Profile />}
          {view === "events" && <EventsManager userRole={user.role} />}
          {view === "requests" && <RequestsManager userRole={user.role} />}
          {view === "donations" && <DonationsManager userRole={user.role} />}
          {view === "reports" && <h1>Reportes</h1>}
        </div>
      </main>
    </div>
  );
}
