import { slide as Menu } from 'react-burger-menu'
import "./BurgerMenu.css"

export default function BurgerMenu() {
    return (
      <Menu>
        <a id="beneficiarios" className="menu-item" href="/base/beneficiary">Beneficiarios</a>
        <a id="donaciones" className="menu-item" href="/base/donations">Donaciones</a>
        <a id="eventos" className="menu-item" href="/base/events">Eventos</a>
        <a id="voluntarios" className="menu-item" href="/base/volunteers">Voluntarios</a>
      </Menu>
    );
  };