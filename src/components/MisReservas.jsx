import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';
import reservaService from '../services/reserva.service.js';
import UserInfo from './UserInfo.jsx';
import '../App.css';

const MisReservas = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      await cargarReservas();
    };

    verificarAutenticacion();
  }, [navigate]);

  const cargarReservas = async () => {
    setLoading(true);
    setError('');
    
    const result = await reservaService.listarMisReservas();
    if (result.success) {
      setReservas(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCancelarReserva = async (id_reserva) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    const result = await reservaService.cancelarReserva(id_reserva);
    if (result.success) {
      alert('Reserva cancelada exitosamente');
      cargarReservas(); // Recargar la lista
    } else {
      alert(`Error al cancelar reserva: ${result.error}`);
    }
  };

  const handleEliminarReserva = async (id_reserva) => {
    const reserva = reservas.find(r => r.id_reserva === id_reserva);
    
    if (!puedeEliminar(reserva)) {
      alert('Solo puedes eliminar la reserva si faltan más de 1 hora para la salida');
      return;
    }

    if (!window.confirm('¿Estás seguro de que quieres ELIMINAR esta reserva? Esta acción no se puede deshacer y se notificará al conductor.')) {
      return;
    }

    const result = await reservaService.eliminarReserva(id_reserva);
    if (result.success) {
      alert('Reserva eliminada exitosamente');
      cargarReservas(); // Recargar la lista
    } else {
      alert(`Error al eliminar reserva: ${result.error}`);
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
    }
  };

  const puedeCancelar = (reserva) => {
    return ['Pendiente', 'Aceptada'].includes(reserva.estado) && 
           new Date(reserva.fecha_salida) > new Date();
  };

  const puedeEliminar = (reserva) => {
    const fechaViaje = new Date(reserva.fecha_salida);
    const ahora = new Date();
    const horasRestantes = (fechaViaje - ahora) / (1000 * 60 * 60); // Diferencia en horas
    
    return ['Pendiente', 'Aceptada'].includes(reserva.estado) && horasRestantes > 1;
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
            <Link to="/mis-reservas" className="nav-link active" onClick={handleNavClick}>
              📋 Mis Reservas
            </Link>
            <Link to="/mis-vehiculos" className="nav-link" onClick={handleNavClick}>
              🚙 Mis Vehículos
            </Link>
            <Link to="/perfil" className="nav-link" onClick={handleNavClick}>
              👤 Mi Perfil
            </Link>
          </nav>
          
          <UserInfo onLogout={() => navigate('/login')} />
        </aside>
        <div className="main-content">
          <div className="loading-container">
            <p>Cargando reservas...</p>
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
          <Link to="/mis-reservas" className="nav-link active" onClick={handleNavClick}>
            📋 Mis Reservas (Hoy)
          </Link>
          <Link to="/mis-vehiculos" className="nav-link" onClick={handleNavClick}>
            🚙 Mis Vehículos
          </Link>
          <Link to="/perfil" className="nav-link" onClick={handleNavClick}>
            👤 Mi Perfil
          </Link>
        </nav>
        
        <UserInfo onLogout={() => navigate('/login')} />
      </aside>

      <main className="main-content">
        <div className="welcome-section">
          <h1>Mis Reservas</h1>
          <p>Aquí puedes ver y gestionar todas tus reservas activas y futuras.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="viajes-grid">
          {reservas.length === 0 ? (
            <div className="no-results">
              <h3>No tienes reservas para hoy</h3>
              <p>¡Explora los viajes disponibles para el día de hoy y haz tu primera reserva!</p>
              <Link to="/viajes" className="btn-success" style={{marginTop: '1rem'}}>
                Ver Viajes Disponibles
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
                    <span className="info-label">📅 Fecha:</span>
                    <span>{formatearFecha(reserva.fecha_salida)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">👤 Conductor:</span>
                    <span>{reserva.nombre_conductor}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🚗 Vehículo:</span>
                    <span>{reserva.marca} {reserva.modelo} - {reserva.placa}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💲 Tarifa:</span>
                    <span>${reserva.tarifa?.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🪑 Cupos reservados:</span>
                    <span>{reserva.cupos_reservados}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📍 Punto de recogida:</span>
                    <span>{reserva.punto_recogida}</span>
                  </div>
                  {reserva.punto_destino && (
                    <div className="info-item">
                      <span className="info-label">📍 Punto de destino:</span>
                      <span>{reserva.punto_destino}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">📝 Reservado el:</span>
                    <span>{formatearFecha(reserva.fecha_reserva)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💰 Total a pagar:</span>
                    <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                      ${(reserva.tarifa * reserva.cupos_reservados)?.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
                <div className="viaje-actions">
                  <div className="actions-row">
                    {puedeCancelar(reserva) && (
                      <button 
                        className="btn-warning"
                        onClick={() => handleCancelarReserva(reserva.id_reserva)}
                        title="Marcar como cancelada"
                      >
                        🚫 Cancelar
                      </button>
                    )}
                    {puedeEliminar(reserva) && (
                      <button 
                        className="btn-danger"
                        onClick={() => handleEliminarReserva(reserva.id_reserva)}
                        title="Eliminar completamente la reserva"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                    {!puedeEliminar(reserva) && ['Pendiente', 'Aceptada'].includes(reserva.estado) && (
                      <span className="tiempo-limite">
                        ⏰ Solo se puede eliminar si faltan más de 1 hora
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MisReservas;