import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import viajeService from '../services/viaje.service.js';
import { getImageUrl } from '../utils/imageUtils.js';
import ReservarViaje from './ReservarViaje.jsx';
import DetallesViaje from './DetallesViaje.jsx';
import UserInfo from './UserInfo.jsx';
import UbicacionSelector from './UbicacionSelector.jsx';
import '../App.css';

const ListaViajes = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const [viajes, setViajes] = useState([]);
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    origen: '',
    destino: '',
    fecha: '',
    tarifaMin: '',
    tarifaMax: '',
    cuposMin: 1
  });
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [mostrarReserva, setMostrarReserva] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      await cargarViajesSinFiltros();
    };

    verificarAutenticacion();
  }, [navigate]);

  // Efecto para aplicar filtros automáticamente cuando cambian
  useEffect(() => {
    if (viajes.length > 0) {
      aplicarTodosLosFiltros();
    }
  }, [filtros, viajes]);

  const aplicarTodosLosFiltros = () => {
    let resultados = [...viajes];

    // Filtro por origen (búsqueda flexible)
    if (filtros.origen.trim()) {
      const origenLower = filtros.origen.toLowerCase();
      resultados = resultados.filter(viaje => 
        viaje.origen?.toLowerCase().includes(origenLower)
      );
    }

    // Filtro por destino (búsqueda flexible)
    if (filtros.destino.trim()) {
      const destinoLower = filtros.destino.toLowerCase();
      resultados = resultados.filter(viaje => 
        viaje.destino?.toLowerCase().includes(destinoLower)
      );
    }

    // Filtro por fecha
    if (filtros.fecha) {
      const fechaFiltro = new Date(filtros.fecha);
      resultados = resultados.filter(viaje => {
        const fechaViaje = new Date(viaje.fecha_salida);
        return fechaViaje.toDateString() === fechaFiltro.toDateString();
      });
    } else {
      // Si no hay filtro de fecha, mostrar solo viajes de hoy en adelante
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      resultados = resultados.filter(viaje => {
        const fechaViaje = new Date(viaje.fecha_salida);
        return fechaViaje >= hoy;
      });
    }

    // Filtro por tarifa mínima
    if (filtros.tarifaMin && !isNaN(filtros.tarifaMin)) {
      const tarifaMin = parseFloat(filtros.tarifaMin);
      resultados = resultados.filter(viaje => viaje.tarifa >= tarifaMin);
    }

    // Filtro por tarifa máxima
    if (filtros.tarifaMax && !isNaN(filtros.tarifaMax)) {
      const tarifaMax = parseFloat(filtros.tarifaMax);
      resultados = resultados.filter(viaje => viaje.tarifa <= tarifaMax);
    }

    // Filtro por cupos mínimos
    if (filtros.cuposMin && !isNaN(filtros.cuposMin)) {
      const cuposMin = parseInt(filtros.cuposMin);
      resultados = resultados.filter(viaje => viaje.cupos_disponibles >= cuposMin);
    }

    // Ordenar por fecha de salida
    resultados.sort((a, b) => new Date(a.fecha_salida) - new Date(b.fecha_salida));

    setViajesFiltrados(resultados);
  };

  const handleFiltroChange = (e) => {
    const nuevosFiltros = {
      ...filtros,
      [e.target.name]: e.target.value
    };
    setFiltros(nuevosFiltros);
    // Los filtros se aplicarán automáticamente por el useEffect
  };

  const cargarViajesSinFiltros = async () => {
    setLoading(true);
    setError('');
    
    const result = await viajeService.listarViajesDisponibles();
    if (result.success) {
      setViajes(result.data);
      setViajesFiltrados(result.data);
    } else {
      setError(result.error);
      setViajes([]);
      setViajesFiltrados([]);
    }
    setLoading(false);
  };

  const handleLimpiarFiltros = () => {
    const filtrosLimpios = {
      origen: '',
      destino: '',
      fecha: '',
      tarifaMin: '',
      tarifaMax: '',
      cuposMin: 1
    };
    setFiltros(filtrosLimpios);
    // Los filtros se aplicarán automáticamente y mostrarán todos los viajes
  };

  const handleReservarViaje = (viaje) => {
    const usuario = authService.getUser();
    
    // Verificar que no sea el propio conductor
    if (viaje.id_conductor === usuario?.id_usuario) {
      alert('No puedes reservar en tu propio viaje');
      return;
    }

    // Verificar que el viaje esté disponible
    if (viaje.estado !== 'Activo' || viaje.cupos_disponibles === 0) {
      alert('Este viaje no está disponible para reservas');
      return;
    }

    setViajeSeleccionado(viaje);
    setMostrarReserva(true);
  };

  const handleVerDetalles = (viaje) => {
    setViajeSeleccionado(viaje);
    setMostrarDetalles(true);
  };

  const handleCerrarModales = () => {
    setMostrarReserva(false);
    setMostrarDetalles(false);
    setViajeSeleccionado(null);
  };

  const handleReservaCreada = () => {
    // Cerrar el modal primero
    setMostrarReserva(false);
    setViajeSeleccionado(null);
    
    // Recargar los viajes para actualizar cupos
    cargarViajesSinFiltros();
    
    // Mostrar mensaje de éxito
    alert('¡Reserva confirmada exitosamente! Tu cupo ha sido reservado automáticamente.');
  };

  const puedeReservar = (viaje) => {
    const usuario = authService.getUser();
    return viaje.estado === 'Activo' && 
           viaje.cupos_disponibles > 0 && 
           viaje.id_conductor !== usuario?.id_usuario;
  };

  const getEstadoViaje = (viaje) => {
    if (viaje.estado === 'Lleno') return '🔴 Lleno';
    if (viaje.estado === 'Cancelado') return '❌ Cancelado';
    if (viaje.estado === 'Completado') return '✅ Completado';
    if (viaje.cupos_disponibles === 0) return '🔴 Sin cupos';
    return '🟢 Disponible';
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
      <div className="container">
        <div className="loading-container">
          <p>Cargando viajes...</p>
        </div>
      </div>
    );
  }

  const handleNavClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

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
            <Link to="/viajes" className="nav-link active" onClick={handleNavClick}>
              🚗 Viajes Disponibles
            </Link>
            <Link to="/mis-reservas" className="nav-link" onClick={handleNavClick}>
              📋 Mis Reservas
            </Link>
            <Link to="/perfil" className="nav-link" onClick={handleNavClick}>
              👤 Mi Perfil
            </Link>
          </nav>
          
          <UserInfo onLogout={() => navigate('/login')} />
        </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="viajes-header">
    <h1>Viajes Disponibles</h1>
          <p>Encuentra viajes disponibles para hoy y próximos días. Puedes filtrar por fecha, origen y destino.</p>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtros-grid">
            <div className="form-group">
              <label htmlFor="origen">Origen</label>
              <UbicacionSelector
                name="origen"
                value={filtros.origen}
                onChange={handleFiltroChange}
                placeholder="¿Desde dónde?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="destino">Destino</label>
              <UbicacionSelector
                name="destino"
                value={filtros.destino}
                onChange={handleFiltroChange}
                placeholder="¿Hacia dónde vas?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <div className="fecha-input-group">
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={filtros.fecha}
                  onChange={handleFiltroChange}
                />
                <button 
                  type="button" 
                  className="btn-fecha-hoy"
                  onClick={() => setFiltros({...filtros, fecha: new Date().toISOString().split('T')[0]})}
                  title="Ver viajes de hoy"
                >
                  Hoy
                </button>
              </div>
            </div>
          </div>
          
          {/* Botón para filtros avanzados */}
          <div className="filtros-toggle">
            <button 
              type="button" 
              className="btn-outline"
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            >
              {mostrarFiltrosAvanzados ? '🔼 Ocultar filtros avanzados' : '🔽 Mostrar filtros avanzados'}
            </button>
          </div>

          {/* Filtros avanzados */}
          {mostrarFiltrosAvanzados && (
            <div className="filtros-avanzados">
              <div className="filtros-grid">
                <div className="form-group">
                  <label htmlFor="tarifaMin">Tarifa mínima</label>
                  <input
                    type="number"
                    id="tarifaMin"
                    name="tarifaMin"
                    value={filtros.tarifaMin}
                    onChange={handleFiltroChange}
                    placeholder="Ej: 5000"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tarifaMax">Tarifa máxima</label>
                  <input
                    type="number"
                    id="tarifaMax"
                    name="tarifaMax"
                    value={filtros.tarifaMax}
                    onChange={handleFiltroChange}
                    placeholder="Ej: 15000"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cuposMin">Cupos mínimos disponibles</label>
                  <select
                    id="cuposMin"
                    name="cuposMin"
                    value={filtros.cuposMin}
                    onChange={handleFiltroChange}
                  >
                    <option value="1">Al menos 1 cupo</option>
                    <option value="2">Al menos 2 cupos</option>
                    <option value="3">Al menos 3 cupos</option>
                    <option value="4">Al menos 4 cupos</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <div className="filtros-actions">
            <button onClick={handleLimpiarFiltros} className="btn-warning">
              🗑️ Limpiar Filtros
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Lista de viajes */}
        <div className="viajes-grid">
          {viajesFiltrados.length === 0 ? (
            <div className="no-results">
              <h3>No se encontraron viajes</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
              {viajes.length > 0 && (
                <p><small>Mostrando {viajesFiltrados.length} de {viajes.length} viajes disponibles</small></p>
              )}
            </div>
          ) : (
            <>
              <div className="resultados-info">
                <p>Mostrando {viajesFiltrados.length} viaje{viajesFiltrados.length !== 1 ? 's' : ''} disponible{viajesFiltrados.length !== 1 ? 's' : ''}</p>
              </div>
              {viajesFiltrados.map(viaje => (
                <div key={viaje.id_viaje} className="viaje-card">
                  <div className="viaje-header">
                    <h3>{viaje.origen} → {viaje.destino}</h3>
                    <span className="viaje-precio">${viaje.tarifa.toLocaleString()}</span>
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
                        <span className="info-label">👤 Conductor:</span>
                        <span>{viaje.nombre_conductor}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">🚗 Vehículo:</span>
                        <span>{viaje.marca} {viaje.modelo}</span>
                      </div>
                      
                      <div className="info-item">
                        <span className="info-label">🪑 Cupos:</span>
                        <span>{viaje.cupos_disponibles} de {viaje.cupos_totales} disponibles</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">📊 Estado:</span>
                        <span className="estado-viaje">{getEstadoViaje(viaje)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="viaje-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleVerDetalles(viaje)}
                    >
                      👁️ Ver Detalles
                    </button>
                    
                    {puedeReservar(viaje) ? (
                      <button 
                        className="btn-success"
                        onClick={() => handleReservarViaje(viaje)}
                      >
                        🚗 Reservar Cupo
                      </button>
                    ) : (
                      <button 
                        className="btn-disabled"
                        disabled
                        title={
                          viaje.id_conductor === authService.getUser()?.id_usuario 
                            ? "Es tu propio viaje" 
                            : "No disponible para reservas"
                        }
                      >
                        {viaje.id_conductor === authService.getUser()?.id_usuario 
                          ? "Tu viaje" 
                          : "No disponible"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Modal de reserva */}
      {mostrarReserva && viajeSeleccionado && (
        <ReservarViaje
          viaje={viajeSeleccionado}
          onClose={handleCerrarModales}
          onReservaCreada={handleReservaCreada}
        />
      )}

      {/* Modal de detalles */}
      {mostrarDetalles && viajeSeleccionado && (
        <DetallesViaje
          viaje={viajeSeleccionado}
          onCerrar={handleCerrarModales}
          onReservar={handleReservarViaje}
        />
      )}
  </div>
);
};

export default ListaViajes;
