import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import '../App.css';

const MisViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      await cargarViajes();
    };

    verificarAutenticacion();
  }, [navigate]);

  const cargarViajes = async () => {
    setLoading(true);
    // Simular carga de viajes
    setTimeout(() => {
      setViajes([]);
      setLoading(false);
    }, 1000);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="layout">
        <aside className="sidebar">
          <div className="logo">
            <h2>Wheels</h2>
          </div>
          
          <nav>
            <Link to="/menu" className="nav-link">
              🏠 Inicio
            </Link>
            <Link to="/viajes/crear" className="nav-link">
              ➕ Crear Viaje
            </Link>
            <Link to="/mis-viajes" className="nav-link active">
              🗺️ Mis Viajes
            </Link>
            <Link to="/viajes" className="nav-link">
              🚗 Viajes Disponibles
            </Link>
            <Link to="/mis-reservas" className="nav-link">
              📋 Mis Reservas
            </Link>
            <Link to="/mis-vehiculos" className="nav-link">
              🚙 Mis Vehículos
            </Link>
            <Link to="/perfil" className="nav-link">
              👤 Mi Perfil
            </Link>
          </nav>
          
          <div className="user-info">
            <div className="user-avatar">
              <div className="avatar-placeholder">👤</div>
            </div>
            <p className="user-name">{authService.getUser()?.nombre}</p>
            <button 
              className="logout-btn"
              onClick={() => {
                authService.logout();
                navigate('/login');
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>
        <div className="main-content">
          <div className="loading-container">
            <p>Cargando viajes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <h2>Wheels</h2>
        </div>
        
        <nav>
          <Link to="/menu" className="nav-link">
            🏠 Inicio
          </Link>
          <Link to="/viajes/crear" className="nav-link">
            ➕ Crear Viaje
          </Link>
          <Link to="/mis-viajes" className="nav-link active">
            🗺️ Mis Viajes
          </Link>
          <Link to="/viajes" className="nav-link">
            🚗 Viajes Disponibles
          </Link>
          <Link to="/mis-reservas" className="nav-link">
            📋 Mis Reservas
          </Link>
          <Link to="/mis-vehiculos" className="nav-link">
            🚙 Mis Vehículos
          </Link>
          <Link to="/perfil" className="nav-link">
            👤 Mi Perfil
          </Link>
        </nav>
        
        <div className="user-info">
          <div className="user-avatar">
            <div className="avatar-placeholder">👤</div>
          </div>
          <p className="user-name">{authService.getUser()?.nombre}</p>
          <button 
            className="logout-btn"
            onClick={() => {
              authService.logout();
              navigate('/login');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="welcome-section">
          <h1>Mis Viajes</h1>
          <p>Aquí puedes ver y gestionar los viajes que has ofrecido.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="viajes-grid">
          {viajes.length === 0 ? (
            <div className="no-results">
              <h3>No has creado ningún viaje aún</h3>
              <p>¡Anímate a ofrecer tu primer viaje!</p>
              <Link to="/viajes/crear" className="btn-primary" style={{marginTop: '1rem'}}>
                Crear Nuevo Viaje
              </Link>
            </div>
          ) : (
            viajes.map(viaje => (
              <div key={viaje.id_viaje} className="viaje-card">
                <div className="viaje-header">
                  <h3>{viaje.origen} → {viaje.destino}</h3>
                  <span className={`viaje-estado ${viaje.estado.toLowerCase()}`}>{viaje.estado}</span>
                </div>
                <div className="viaje-info">
                  <div className="info-item">
                    <span className="info-label">📅 Fecha:</span>
                    <span>{formatearFecha(viaje.fecha_salida)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🪑 Cupos:</span>
                    <span>{viaje.cupos_disponibles} de {viaje.cupos_totales}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💲 Tarifa:</span>
                    <span>${viaje.tarifa.toLocaleString()}</span>
                  </div>
                </div>
                <div className="viaje-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => alert('Ver detalles del viaje ' + viaje.id_viaje)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => alert('Cancelar viaje ' + viaje.id_viaje)}
                  >
                    Cancelar Viaje
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MisViajes;