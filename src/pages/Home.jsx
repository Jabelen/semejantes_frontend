import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import FloatingButton from "../components/FloatingButton";
import Slider from "../components/Slider.jsx";
import "../components/SharedSliderStyles.css";
import "./Home.css";

// Importamos la imagen para el fondo
import heroBg from "../assets/foto2.jpeg"; 

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";

function Home() {
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
              imgAlt: ev.title, 
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
    <div className="home-page">
      <Header />

      {/* SECCIÓN HERO: Imagen Grande y Texto Emotivo */}
      <div className="home-hero">
        <img src={heroBg} alt="Comunidad Semejantes" className="hero-bg-image" />
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <span className="hero-subtitle">ONG Semejantes</span>
          <h1 className="hero-title">Integrando corazones, transformando vidas</h1>
          <p className="hero-quote">
            "Porque cada persona es valiosa, amada y tiene un propósito especial en Dios."
          </p>
        </div>
      </div>

      {/* SECCIÓN SLIDER: Con marco de foto */}
      <div className="slider-section">
        <h2 className="album-title">Nuestros Momentos Recientes</h2>
        
        <div className="album-frame">
          <div className="slider-wrapper-centered">
            {slides.length > 0 ? (
              <Slider>
                {slides.map((slide, index) => {
                  return (
                    <div key={index} className="slide-item-container">
                      <img
                        src={slide.imgURL}
                        alt={slide.imgAlt}
                        className="slide-image-centered"
                      />
                      <div className="slide-title-overlay">
                        <h3 className="slide-title-text">{slide.imgAlt}</h3>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            ) : (
              <div style={{ padding: "50px", textAlign: "center" }}>
                Cargando recuerdos...
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingButton />
    </div>
  );
}

export default Home;