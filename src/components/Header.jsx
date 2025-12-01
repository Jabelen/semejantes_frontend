import logoSemejantes from "../assets/logo_semejantes.png"
import "./Header.css"
import HeaderButton from "./HeaderButton";

export default function Header() {
    return (
        <header className="header">
            <nav>
                <div className="row">
                    <img src= {logoSemejantes} alt="Company Logo" className="logo" />
                    <HeaderButton href="./" headerText="Inicio"/>
                    <HeaderButton href="/about" headerText="Quiénes Somos"/>
                    <HeaderButton href="/services" headerText="Qué hacemos"/>
                    <HeaderButton href="/events" headerText="Eventos"/>
                    <HeaderButton href="/alliance" headerText="Alianzas y Apoyo"/>
                    <HeaderButton href="/contact" headerText="Contacto"/>
                    <HeaderButton href="/donations" headerText="Donaciones"/>
                </div>
            </nav>
        </header>
    );
}
