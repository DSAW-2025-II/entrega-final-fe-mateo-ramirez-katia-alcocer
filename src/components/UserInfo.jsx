import React, { useState, useEffect } from 'react';
import authService from '../services/auth.service.js';
import { getImageUrl } from '../utils/imageUtils.js';

const UserInfo = ({ onLogout }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const loadUserInfo = () => {
      const user = authService.getUser();
      if (user) {
        setUsuario(user);
      }
    };

    loadUserInfo();
    
    // Escuchar cambios en el localStorage para actualizar automáticamente
    const handleStorageChange = () => {
      loadUserInfo();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar un evento personalizado para cuando se actualiza el perfil
    const handleProfileUpdate = () => {
      loadUserInfo();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="user-info">
      <div className="user-avatar">
        {usuario?.foto_perfil ? (
          <img 
            src={getImageUrl(usuario.foto_perfil)} 
            alt="Avatar" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="avatar-placeholder" style={{display: usuario?.foto_perfil ? 'none' : 'flex'}}>👤</div>
      </div>
      <p className="user-name">{usuario?.nombre}</p>
      <button onClick={handleLogout} className="logout-btn">
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserInfo;