import Header from '../components/Header.jsx';
import FloatingButton from "../components/FloatingButton";
import './About.css'; // Importamos los estilos nuevos
// Importamos una de las fotos que subiste para usarla de fondo
import fotoFamilia from '../assets/foto1.jpeg'; 

export default function About() {
    return(
        <div className="about-page">
            <Header/>
            
            {/* HERO SECTION: Imagen emotiva de fondo + Título */}
            <div className="about-hero">
                <img src={fotoFamilia} alt="Familia Semejantes" className="about-hero-img" />
                <div className="about-hero-content">
                    <h1>Quiénes Somos</h1>
                    <h3>ONG Semejantes</h3>
                </div>
            </div>

            <div className="about-container">
                
                {/* Tarjetas de Misión y Visión una al lado de la otra */}
                <div className="mv-grid">
                    <div className="sentiment-card">
                        <h2>Misión</h2>
                        <p>
                            ONG Semejantes promueve y capacita a través de una mirada cristiana, 
                            a quienes se interesan en trabajar con personas con discapacidad y sus familias. 
                            Promoviendo su inclusión en las distintas áreas de su comunidad con amor y dedicación.
                        </p>
                    </div>

                    <div className="sentiment-card">
                        <h2>Visión</h2>
                        <p>
                            Somos un movimiento que reconoce que <strong>cada persona es valiosa, amada 
                            y tiene un propósito en Dios</strong>. Buscamos que, a través de la formación de equipos 
                            y proyectos locales, todas las personas puedan participar plenamente.
                        </p>
                    </div>
                </div>

                {/* Sección de Propósito destacada */}
                <div className="purpose-section">
                    <h2>Nuestro Propósito</h2>
                    <p>
                        Lograr que las personas que viven una discapacidad participen activamente 
                        en las comunidades cristianas, promoviendo y capacitando a los voluntarios. 
                        Además entregar apoyo material y espiritual a los diferentes estamentos 
                        de la sociedad civil que se involucren con estas temáticas.
                    </p>
                </div>

                {/* Historia en formato de lista limpia */}
                <div className="history-container">
                    <h2>Nuestra Historia</h2>
                    
                    <div className="history-item">
                        <div className="year-badge">2014</div>
                        <div>
                            <p>Nace ONG Semejantes por un convenio firmado entre Joni&Friends y la iglesia Alianza Cristiana y Misionera en Chile.</p>
                        </div>
                    </div>

                    <div className="history-item">
                        <div className="year-badge">2015</div>
                        <div>
                            <p>Se realiza la formación de un primer grupo de voluntarios comprometidos con el servicio.</p>
                        </div>
                    </div>

                    <div className="history-item">
                        <div className="year-badge">2016</div>
                        <div>
                            <p>Certificación de 9 instructores en el estudio “Más allá del Sufrimiento”.</p>
                        </div>
                    </div>

                    <div className="history-item">
                        <div className="year-badge">2017-19</div>
                        <div>
                            <p>Realización de múltiples talleres formativos de voluntarios en regiones.</p>
                        </div>
                    </div>

                    <div className="history-item">
                        <div className="year-badge">Actual</div>
                        <div>
                            <p>Existen grupos de voluntarios de Iquique a Punta Arenas que trabajan para aumentar la participación de las familias en las comunidades.</p>
                        </div>
                    </div>
                </div>
            </div>

            <FloatingButton/>
        </div>
    );
}