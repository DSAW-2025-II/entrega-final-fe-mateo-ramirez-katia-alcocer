import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service.js";
import { getImageUrl } from "../utils/imageUtils.js";
import "../App.css";

const MenuPasajero = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      const usuario = authService.getUser();
      if (usuario) {
        setUsuario(usuario);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    verificarAutenticacion();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando...</p>
      </div>
    );
  }

      return (
        <div className="layout">
          <button 
            className={`mobile-menu-btn ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="menu-text">Wheels</span>
            <span className="menu-icon">{sidebarOpen ? '✕' : '☰'}</span>
          </button>
          {sidebarOpen && (
            <div 
              className="sidebar-overlay active"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="logo">
                <h2>Wheels</h2>
              </div>
            </div>
        <nav>
          <Link to="/menu" className="nav-link">
            🏠 Inicio
          </Link>
              <Link to="/viajes" className="nav-link">
                🚗 Viajes Disponibles
              </Link>
              <Link to="/mis-reservas" className="nav-link">
                📋 Mis Reservas
              </Link>
          <Link to="/registrar-vehiculo" className="nav-link">
            🚙 Añadir Vehículo
          </Link>
          <Link to="/perfil" className="nav-link">
            👤 Mi Perfil
          </Link>
        </nav>
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
      </aside>

      <main className="main-content">
        <div className="welcome-section">
          <h1>¡Bienvenido, {usuario?.nombre}!</h1>
          <p>Aquí podrás gestionar tus viajes como pasajero.</p>
        </div>
        
        <div className="quick-actions">
          <div className="action-card">
            <h3>🚗 Buscar Viajes</h3>
            <p>Encuentra viajes disponibles para tu destino</p>
            <Link to="/viajes" className="btn-primary">Ver Viajes</Link>
          </div>
          
              <div className="action-card">
                <h3>🚙 Ser Conductor</h3>
                <p>Registra tu vehículo y ofrece viajes</p>
                <Link to="/registrar-vehiculo" className="btn-secondary">Añadir Vehículo</Link>
              </div>
              
              <div className="action-card">
                <h3>📋 Mis Reservas</h3>
                <p>Gestiona tus reservas como pasajero</p>
                <Link to="/mis-reservas" className="btn-secondary">Ver Reservas</Link>
              </div>
        </div>
      </main>
    </div>
  );
};

export default MenuPasajero;
