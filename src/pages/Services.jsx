import Header from "../components/Header.jsx";
import FloatingButton from "../components/FloatingButton";
import "./Services.css";

// Importamos la imagen de "trabajo" (foto3)
import heroImg from "../assets/foto3.jpeg";

export default function Services() {
  return (
    <div className="services-page">
      <Header />

      {/* HERO: Imagen de fondo con título */}
      <div className="services-hero">
        <img src={heroImg} alt="Servicio Semejantes" className="services-hero-img" />
        <div className="services-hero-content">
          <h1>Qué Hacemos</h1>
          <h2>Servicio y disposición en amor</h2>
        </div>
      </div>

      <div className="services-container">
        {/* INTRODUCCIÓN */}
        <div className="services-intro">
          <p>
            ONG Semejantes promueve el bienestar y participación de las personas
            que viven una condición de discapacidad y de sus familias, en
            diferentes actividades de la comunidad, especialmente en el aspecto
            espiritual y social.
          </p>
        </div>

        {/* GRID DE SERVICIOS PRINCIPALES */}
        <div className="services-grid">
          {/* Tarjeta 1 */}
          <div className="service-card">
            <h3>Acompañamiento</h3>
            <p>
              A través de proyectos elaborados por equipos de profesionales,
              buscamos dar respuesta a las necesidades de las personas con
              discapacidad en sus comunidades, mediante un trabajo colaborativo
              con agrupaciones, iglesias y municipios.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="service-card">
            <h3>Ayuda Técnica</h3>
            <p>
              En asociación con "Ruedas para el Mundo" (Joni&Friends),
              entregamos ayudas técnicas en comodato como sillas de ruedas y
              bastones. Incluye postulación, entrega personalizada y seguimiento
              voluntario para el cuidado integral.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="service-card">
            <h3>Apoyo Médico y Social</h3>
            <p>
              Evaluación profesional de necesidades realizada por médicos,
              terapeutas ocupacionales y kinesiólogos para quienes postulan a
              ayudas técnicas, asegurando que cada persona reciba el apoyo
              adecuado.
            </p>
          </div>

          {/* Tarjeta 4 */}
          <div className="service-card">
            <h3>Apoyo Psicológico y Espiritual</h3>
            <p>
              Acompañamiento clave en procesos de duelo y noticias difíciles.
              Ayudamos a transitar etapas de incredulidad, temor o aceptación,
              brindando consuelo y esperanza a la persona y su familia.
            </p>
          </div>
        </div>

        {/* SECCIÓN EDUCATIVA Y ESPIRITUAL (Full Width) */}
        <div className="education-section">
          <h2>Apoyo Educativo y Espiritual</h2>
          <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
            Promovemos espacios de enseñanza bíblica accesibles para todas las
            edades, formando en materia de discapacidad a la luz de las
            Escrituras.
          </p>

          {/* CITA BÍBLICA DESTACADA */}
          <div className="bible-quote-box">
            <span className="bible-ref">Mateo 28: 18-20</span>
            <p className="bible-text">
              "Y Jesús se acercó y les habló diciendo: Toda potestad me es dada
              en el cielo y en la tierra. Por tanto, id, y haced discípulos a
              todas las naciones... enseñándoles que guarden todas las cosas que
              os he mandado; y he aquí yo estoy con vosotros todos los días,
              hasta el fin del mundo. Amén."
            </p>
          </div>

          <h3 style={{ marginTop: "40px", color: "#1a3c6d" }}>Departamento de Educación Cristiana</h3>
          <p style={{ color: "#555" }}>
            Líderes y profesionales comprometidos con la formación inclusiva en
            las iglesias y la sociedad civil. Nuestras líneas de acción son:
          </p>

          {/* LISTA DE ACCIONES */}
          <ul className="action-list">
            <li>Formación en discapacidad para iglesias</li>
            <li>Adaptación de material bíblico de estudio</li>
            <li>Actividades de estudio y capacitación</li>
            <li>Difusión de manuales de educación cristiana</li>
          </ul>
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}