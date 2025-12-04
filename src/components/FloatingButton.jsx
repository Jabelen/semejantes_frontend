import React from 'react';
import './FloatingButton.css';
// Importa el nuevo icono de usuario
import icon from '../assets/floating_button_user_icon.png'; 

const FloatingButton = () => {
  const handleClick = () => {
    // Aquí puedes definir la acción que quieres que realice el botón
    console.log('Botón de perfil presionado');
    // Por ejemplo, navegar a la página de perfil del usuario
    window.location.href = '/base';
  };

  return (
    <div className="floating-button-container">
      <button className="floating-button" onClick={handleClick}>
        <img src={icon} alt="Icono de Usuario" className="floating-button-icon" />
      </button>
    </div>
  );
};

export default FloatingButton;