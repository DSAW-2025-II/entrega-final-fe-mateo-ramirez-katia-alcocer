import React from 'react';

const MobileMenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button 
      className="mobile-menu-toggle"
      onClick={onToggle}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    >
      {isOpen ? '✕' : '☰'}
    </button>
  );
};

export default MobileMenuToggle;