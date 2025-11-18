import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';
import reservaService from '../services/reserva.service.js';
import UserInfo from './UserInfo.jsx';
import '../App.css';

const GestionarSolicitudes = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    cargarSolicitudes();
  }, [navigate]);

  const cargarSolicitudes = async () => {
    setLoading(true);
    setError('');
    
    const result = await reservaService.listarSolicitudesConductor();
    if (result.success) {
      setReservas(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleAceptarReserva = async (id_reserva) => {
    const result = await reservaService.aceptarReserva(id_reserva);
    if (result.success) {
      alert('Reserva aceptada exitosamente');
      cargarSolicitudes(); // Recargar la lista
    } else {
      alert(`Error al aceptar reserva: ${result.error}`);
    }
  };

  const handleRechazarReserva = async (id_reserva) => {
    if (!window.confirm('¿Estás seguro de que quieres rechazar esta reserva?')) {
      return;
    }

    const result = await reservaService.rechazarReserva(id_reserva);
    if (result.success) {
      alert('Reserva rechazada');
      cargarSolicitudes(); // Recargar la lista
    } else {
      alert(`Error al rechazar reserva: ${result.error}`);
    }
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

  const getEstadoReserva = (estado) => {
    switch (estado) {
      case 'Pendiente': return '⏳ Pendiente';
      case 'Aceptada': return '✅ Aceptada';
      case 'Rechazada': return '❌ Rechazada';
      case 'Cancelada': return '🚫 Cancelada';
      default: return estado;
    }
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return '#ffa500';
      case 'Aceptada': return '#28a745';
      case 'Rechazada': return '#dc3545';
      case 'Cancelada': return '#6c757d';
      default: return '#000';
    };
  };

  const handleNavClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="logo">
            <h2>Wheels</h2>
          </div>
          
          <UserInfo onLogout={() => navigate('/login')} />
        </aside>
        <div className="main-content">
          <div className="loading-container">
            <p>Cargando solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="logo">
          <h2>Wheels</h2>
        </div>
        
        <nav>
          <Link to="/menu" className="nav-link" onClick={handleNavClick}>
            🏠 Inicio
          </Link>
          <Link to="/viajes/crear" className="nav-link" onClick={handleNavClick}>
            ➕ Crear Viaje
          </Link>
          <Link to="/mis-viajes" className="nav-link" onClick={handleNavClick}>
            🗺️ Mis Viajes
          </Link>
          <Link to="/viajes" className="nav-link" onClick={handleNavClick}>
            🚗 Viajes Disponibles
          </Link>
          <Link to="/mis-reservas" className="nav-link" onClick={handleNavClick}>
            📋 Mis Reservas
          </Link>
          <Link to="/gestionar-solicitudes" className="nav-link active" onClick={handleNavClick}>
            📥 Gestionar Solicitudes
          </Link>
          <Link to="/mis-vehiculos" className="nav-link" onClick={handleNavClick}>
            🚙 Mis Vehículos
          </Link>
          <Link to="/perfil" className="nav-link" onClick={handleNavClick}>
            👤 Mi Perfil
          </Link>
          </nav>
          
          <UserInfo onLogout={() => navigate('/login')} />
        </aside>      <main className="main-content">
        <div className="welcome-section">
          <h1>Gestionar Solicitudes</h1>
          <p>Aquí puedes revisar y gestionar las solicitudes de reserva para tus viajes.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="viajes-grid">
          {reservas.length === 0 ? (
            <div className="no-results">
              <h3>No tienes solicitudes pendientes</h3>
              <p>Cuando alguien solicite un cupo en tus viajes, aparecerán aquí.</p>
              <Link to="/viajes/crear" className="btn-success" style={{marginTop: '1rem'}}>
                Crear Nuevo Viaje
              </Link>
            </div>
          ) : (
            reservas.map(reserva => (
              <div key={reserva.id_reserva} className="viaje-card">
                <div className="viaje-header">
                  <h3>{reserva.origen} → {reserva.destino}</h3>
                  <span 
                    className={`viaje-estado ${reserva.estado?.toLowerCase()}`}
                    style={{ color: getColorEstado(reserva.estado) }}
                  >
                    {getEstadoReserva(reserva.estado)}
                  </span>
                </div>
                <div className="viaje-info">
                  <div className="info-item">
                    <span className="info-label">👤 Pasajero:</span>
                    <span>{reserva.nombre_pasajero || 'Usuario'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📅 Fecha del viaje:</span>
                    <span>{formatearFecha(reserva.fecha_salida)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📝 Solicitado:</span>
                    <span>{formatearFecha(reserva.fecha_reserva)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💲 Tarifa:</span>
                    <span>${reserva.tarifa?.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🪑 Cupos solicitados:</span>
                    <span>{reserva.cupos_reservados}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📍 Recogida:</span>
                    <span>{reserva.punto_recogida || 'Por definir'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📍 Destino:</span>
                    <span>{reserva.destino}</span>
                  </div>
                  {reserva.telefono_pasajero && (
                    <div className="info-item">
                      <span className="info-label">📞 Teléfono:</span>
                      <span>{reserva.telefono_pasajero}</span>
                    </div>
                  )}
                </div>
                
                {reserva.estado === 'Pendiente' && (
                  <div className="viaje-actions">
                    <button 
                      className="btn-success"
                      onClick={() => handleAceptarReserva(reserva.id_reserva)}
                    >
                      ✅ Aceptar
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleRechazarReserva(reserva.id_reserva)}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default GestionarSolicitudes;