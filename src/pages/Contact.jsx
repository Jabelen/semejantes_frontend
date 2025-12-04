import React from 'react';
import Header from '../components/Header.jsx';
import FloatingButton from "../components/FloatingButton";
import './Contact.css';

export default function Contact() {
    return(
        <div className="contact-page">
            <Header/>
            
            {/* Hero Section con fondo azul */}
            <div className="contact-hero">
                <h1>Contáctanos</h1>
                <p>Estamos a un clic de distancia</p>
            </div>
            
            <div className="contact-content">
                <div className="contact-grid">
                    {/* 1. Correo */}
                    <a href="mailto:contacto@semejantes.cl" className="contact-card">
                        <span className="card-icon">📧</span>
                        <span className="card-title">Correo</span>
                        <span className="card-action">Envíanos un email</span>
                    </a>

                    {/* 2. WhatsApp */}
                    <a href="https://wa.me/56912345678" target="_blank" rel="noreferrer" className="contact-card">
                        <span className="card-icon">💬</span>
                        <span className="card-title">WhatsApp</span>
                        <span className="card-action">Chatea con nosotros</span>
                    </a>

                    {/* 3. Instagram */}
                    <a href="https://www.instagram.com/semejantes.chile/" target="_blank" rel="noreferrer" className="contact-card">
                        <span className="card-icon">📷</span>
                        <span className="card-title">Instagram</span>
                        <span className="card-action">Mira nuestras fotos</span>
                    </a>

                    {/* 4. Facebook */}
                    <a href="https://www.facebook.com/semejantes.alianza" target="_blank" rel="noreferrer" className="contact-card">
                        <span className="card-icon">👥</span>
                        <span className="card-title">Facebook</span>
                        <span className="card-action">Síguenos</span>
                    </a>
                </div>
            </div>

            <FloatingButton/>
        </div>
    );
}