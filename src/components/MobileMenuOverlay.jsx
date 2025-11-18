import React from 'react';

const MobileMenuOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
    />
  );
};

export default MobileMenuOverlay;