import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { slide as Menu } from "react-burger-menu";
import Header from "../components/Header";
import Profile from "./Profile";

import DashboardHome from "../components/dashboard/DashboardHome";
import EventsManager from "../components/dashboard/EventsManager";
import RequestsManager from "../components/dashboard/RequestsManager";
import DonationsManager from "../components/dashboard/DonationsManager";
import UsersManager from "../components/dashboard/UsersManager";
import ReportsManager from "../components/dashboard/ReportsManager";

import "../components/BurgerMenu.css";
import "./Base.css";

export default function Base() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "home";
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const setView = (newView) => {
    setSearchParams({ view: newView });
  };

  if (!user) return null;

  return (
    <div id="outer-container">
      <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <div className="menu-header">Hola, {user.username}</div>

        <a className="menu-item" onClick={() => setView("home")}>
          🏠 Inicio
        </a>
        <a className="menu-item" onClick={() => setView("profile")}>
          👤 Mi Perfil
        </a>
        <a className="menu-item" onClick={() => setView("events")}>
          📅 Eventos
        </a>

        {user.role === "Coordinator" && (
          <>
            <a className="menu-item" onClick={() => setView("users")}>
              👥 Usuarios Pendientes
            </a>
            <a className="menu-item" onClick={() => setView("donations")}>
              🎁 Inventario
            </a>
            <a className="menu-item" onClick={() => setView("requests")}>
              📝 Solicitudes
            </a>
            <a className="menu-item" onClick={() => setView("reports")}>
              📊 Reportes
            </a>
          </>
        )}

        {user.role === "Volunteer" && (
          <>
            <a className="menu-item" onClick={() => setView("requests")}>
              🙏 Pedir Ayuda
            </a>
            <a className="menu-item" onClick={() => setView("donations")}>
              🎁 Ver Donaciones
            </a>
          </>
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
          {view === "home" && (
            <DashboardHome setView={setView} userRole={user.role} />
          )}
          {view === "profile" && <Profile />}
          {view === "events" && <EventsManager userRole={user.role} />}
          {view === "requests" && <RequestsManager userRole={user.role} />}
          {view === "donations" && <DonationsManager userRole={user.role} />}
          {view === "users" && <UsersManager />}
          {view === "reports" && <ReportsManager />}
        </div>
      </main>
    </div>
  );
}
