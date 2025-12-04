import Header from '../components/Header.jsx';
import FloatingButton from "../components/FloatingButton";
import './Alliance.css';

// CAMBIO: Importamos logo_alianza en lugar de logo_semejantes
import logoAlianza from "../assets/logo_alianza.jpg"; 
// Importamos el otro logo partner
import logoJoni from "../assets/logo_jonifriends.png"; 

export default function Alliance() {
    return(
        <div className="alliance-page">
            <Header/>
            
            {/* HERO SECTION */}
            <div className="alliance-hero">
                <h1>Alianzas y Apoyo</h1>
                <h2>Unidos por un propósito mayor</h2>
            </div>

            <div className="alliance-container">
                
                {/* TARJETA DE TEXTO */}
                <div className="alliance-intro-card">
                    <p>
                        ONG Semejantes, en conjunto con <strong>Joni&Friends</strong> y la iglesia 
                        <strong> ACyM Chile</strong>, promueve un trabajo colaborativo con otras agrupaciones, 
                        entidades gubernamentales y no gubernamentales.
                    </p>
                    <p>
                        Creemos firmemente que el trabajo en equipo es esencial para lograr el 
                        objetivo de aumentar la participación y el bienestar de las personas con 
                        discapacidad en nuestra comunidad.
                    </p>
                </div>

                {/* SECCIÓN DE LOGOS LADO A LADO */}
                <div className="partners-section">
                    <h2 className="partners-title">Nuestra Alianza Estratégica</h2>
                    
                    <div className="logos-grid">
                        {/* Logo 1: Alianza Cristiana y Misionera */}
                        <img 
                            src={logoAlianza} 
                            alt="Logo Alianza Cristiana y Misionera" 
                            className="partner-logo" 
                        />
                        
                        {/* Logo 2: Joni & Friends */}
                        <img 
                            src={logoJoni} 
                            alt="Logo Joni & Friends" 
                            className="partner-logo" 
                        />
                    </div>
                </div>
            </div>

            <FloatingButton/>
        </div>
    );
}