import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import viajeService from '../services/viaje.service.js';
import { getImageUrl } from '../utils/imageUtils.js';
import DetallesViaje from './DetallesViaje.jsx';
import UserInfo from './UserInfo.jsx';
import '../App.css';

const MisViajes = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
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
    setError('');
    
    const result = await viajeService.listarMisViajes();
    if (result.success) {
      setViajes(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const puedeModificarViaje = (viaje) => {
    const fechaViaje = new Date(viaje.fecha_salida);
    const ahora = new Date();
    const horasRestantes = (fechaViaje - ahora) / (1000 * 60 * 60); // Diferencia en horas
    
    // Debug para ver qué está pasando
    console.log('=== DEBUG CANCELAR VIAJE ===');
    console.log('Fecha del viaje:', viaje.fecha_salida);
    console.log('Fecha parseada:', fechaViaje);
    console.log('Fecha actual:', ahora);
    console.log('Horas restantes:', horasRestantes);
    console.log('Puede modificar:', horasRestantes > 1);
    console.log('==========================');
    
    return horasRestantes > 1; // Más de 1 hora de anticipación
  };

  const handleCancelarViaje = async (id_viaje) => {
    const viaje = viajes.find(v => v.id_viaje === id_viaje);
    
    if (!puedeModificarViaje(viaje)) {
      alert('Solo puedes cancelar el viaje si faltan más de 1 hora para la salida');
      return;
    }

    if (!window.confirm('¿Estás seguro de que quieres cancelar este viaje? Se notificará a todos los pasajeros.')) {
      return;
    }

    const result = await viajeService.cancelarViaje(id_viaje);
    if (result.success) {
      alert('Viaje cancelado exitosamente');
      cargarViajes(); // Recargar la lista
    } else {
      alert(`Error al cancelar viaje: ${result.error}`);
    }
  };

  const handleCompletarViaje = async (id_viaje) => {
    if (!window.confirm('¿Estás seguro de que quieres marcar este viaje como completado?')) {
      return;
    }

    const result = await viajeService.completarViaje(id_viaje);
    if (result.success) {
      alert('Viaje completado exitosamente');
      cargarViajes(); // Recargar la lista
    } else {
      alert(`Error al completar viaje: ${result.error}`);
    }
  };

  const handleVerDetalles = (viaje) => {
    setViajeSeleccionado(viaje);
    setMostrarDetalles(true);
  };

  const handleCerrarDetalles = () => {
    setMostrarDetalles(false);
    setViajeSeleccionado(null);
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
            <Link to="/mis-viajes" className="nav-link active" onClick={handleNavClick}>
              🗺️ Mis Viajes
            </Link>
            <Link to="/viajes" className="nav-link" onClick={handleNavClick}>
              🚗 Viajes Disponibles
            </Link>
            <Link to="/mis-reservas" className="nav-link" onClick={handleNavClick}>
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
            <p>Cargando viajes...</p>
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
          <Link to="/mis-viajes" className="nav-link active" onClick={handleNavClick}>
            🗺️ Mis Viajes
          </Link>
          <Link to="/viajes" className="nav-link" onClick={handleNavClick}>
            🚗 Viajes Disponibles
          </Link>
          <Link to="/mis-reservas" className="nav-link" onClick={handleNavClick}>
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
          <h1>Mis Viajes</h1>
          <p>Aquí puedes ver y gestionar todos tus viajes como conductor.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="viajes-grid">
          {viajes.length === 0 ? (
            <div className="no-results">
              <h3>No tienes viajes para hoy</h3>
              <p>¡Anímate a ofrecer un viaje para el día de hoy!</p>
              <Link to="/viajes/crear" className="btn-success" style={{marginTop: '1rem'}}>
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
                
                <div className="viaje-content">
                  <div className="vehiculo-image-section">
                    {viaje.foto ? (
                      <img 
                        src={getImageUrl(viaje.foto)} 
                        alt={`${viaje.marca} ${viaje.modelo}`}
                        className="vehiculo-foto"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="vehiculo-placeholder" style={{display: viaje.foto ? 'none' : 'flex'}}>
                      🚗
                    </div>
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
                      <span>${viaje.tarifa?.toLocaleString()}</span>
                    </div>
                    {viaje.marca && viaje.modelo && (
                      <div className="info-item">
                        <span className="info-label">🚗 Vehículo:</span>
                        <span>{viaje.marca} {viaje.modelo} - {viaje.placa}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="viaje-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => handleVerDetalles(viaje)}
                  >
                    👁️ Ver Detalles
                  </button>
                  {(viaje.estado === 'Activo' || viaje.estado === 'Lleno') && (
                    <>
                      <button 
                        className="btn-success"
                        onClick={() => handleCompletarViaje(viaje.id_viaje)}
                      >
                        ✅ Completar Viaje
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleCancelarViaje(viaje.id_viaje)}
                        disabled={!puedeModificarViaje(viaje)}
                        title={!puedeModificarViaje(viaje) ? "Solo se puede cancelar si faltan más de 1 hora para la salida" : ""}
                      >
                        ❌ Cancelar Viaje
                      </button>
                    </>
                  )}
                  {viaje.estado === 'Expirado' && (
                    <span className="viaje-estado-info expirado">
                      ⏰ Este viaje expiró automáticamente
                    </span>
                  )}
                  {!['Activo', 'Lleno', 'Expirado'].includes(viaje.estado) && (
                    <span className="viaje-estado-info">
                      Este viaje está {viaje.estado.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal de detalles */}
      {mostrarDetalles && viajeSeleccionado && (
        <DetallesViaje
          viaje={viajeSeleccionado}
          onCerrar={handleCerrarDetalles}
        />
      )}
    </div>
  );
};

export default MisViajes;