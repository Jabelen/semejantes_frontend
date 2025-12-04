import { slide as Menu } from 'react-burger-menu';
import "./BurgerMenu.css";

export default function BurgerMenu() {
    return (
      <Menu>
        {/* Título del menú para dar contexto */}
        <div className="menu-header">Navegación</div>

        {/* Opción Inicio */}
        <a id="home" className="menu-item" href="/">
            <span>🏠</span> Inicio
        </a>

        {/* Opción Beneficiarios */}
        <a id="beneficiarios" className="menu-item" href="/base/beneficiary">
            <span>👥</span> Beneficiarios
        </a>

        {/* Opción Donaciones */}
        <a id="donaciones" className="menu-item" href="/base/donations">
            <span>🎁</span> Donaciones
        </a>

        {/* Opción Eventos */}
        <a id="eventos" className="menu-item" href="/base/events">
            <span>📅</span> Eventos
        </a>

        {/* Opción Voluntarios */}
        <a id="voluntarios" className="menu-item" href="/base/volunteers">
            <span>🙋</span> Voluntarios
        </a>
      </Menu>
    );
};