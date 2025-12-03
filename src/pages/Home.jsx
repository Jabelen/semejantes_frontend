import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import FloatingButton from "../components/FloatingButton";
import Slider from "../components/Slider.jsx";
// 1. IMPORTAMOS LOS NUEVOS ESTILOS COMPARTIDOS
import "../components/SharedSliderStyles.css";
import "./Home.css";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";

function Home() {
  // ... (Todo el código de useState, useEffect y fetchEventsImages sigue IGUAL) ...
  const [slides, setSlides] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEventsImages();
  }, []);

  const fetchEventsImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();

      if (data.status === "success" && data.data.length > 0) {
        const sortedEvents = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const eventsWithImages = sortedEvents.filter(
          (ev) => ev.images && ev.images.length > 0
        );
        const last4Events = eventsWithImages.slice(0, 4);

        if (last4Events.length > 0) {
          setSlides(
            last4Events.map((ev) => ({
              imgURL: ev.images[0],
              imgAlt: ev.title, // Usamos esto como título
            }))
          );
        } else {
          setSlides([
            { imgURL: DEFAULT_IMAGE, imgAlt: "Bienvenidos a Semejantes" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      setSlides([{ imgURL: DEFAULT_IMAGE, imgAlt: "Error de carga" }]);
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="home-hero-text">
        {" "}
        {/* Asegúrate de tener estilos para esto en Home.css si quieres */}
        <h2>ONG Semejantes</h2>
        <h1>Integrando a personas con discapacidad</h1>
        <h2>Porque cada persona es valiosa, amada y tiene propósito en Dios</h2>
      </div>

      {/* 2. USAMOS EL NUEVO CONTENEDOR WRAPPER */}
      <div className="slider-wrapper-centered">
        {slides.length > 0 ? (
          <Slider>
            {slides.map((slide, index) => {
              // 3. CAMBIAMOS LA ESTRUCTURA INTERNA
              return (
                <div key={index} className="slide-item-container">
                  <img
                    src={slide.imgURL}
                    alt={slide.imgAlt}
                    className="slide-image-centered"
                  />
                  {/* Capa del título */}
                  <div className="slide-title-overlay">
                    <h3 className="slide-title-text">{slide.imgAlt}</h3>
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          <div style={{ padding: "50px", textAlign: "center" }}>
            Cargando eventos recientes...
          </div>
        )}
      </div>

      <div>
        <FloatingButton />
      </div>
    </>
  );
}

export default Home;
