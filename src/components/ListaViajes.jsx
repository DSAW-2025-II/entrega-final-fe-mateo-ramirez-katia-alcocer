import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import viajeService from '../services/viaje.service.js';
import '../App.css';

const ListaViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    origen: '',
    destino: '',
    fecha: ''
  });
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
    // Simulamos datos de viajes por ahora
    const viajesSimulados = [
      {
        id_viaje: 1,
        origen: 'Bogotá',
        destino: 'Chía',
        fecha_salida: '2024-01-15T08:00:00',
        tarifa: 15000,
        nombre_conductor: 'Juan Pérez',
        marca: 'Toyota',
        modelo: '2020',
        cupos_disponibles: 3,
        cupos_totales: 4
      },
      {
        id_viaje: 2,
        origen: 'Chía',
        destino: 'Bogotá',
        fecha_salida: '2024-01-15T17:00:00',
        tarifa: 12000,
        nombre_conductor: 'María García',
        marca: 'Honda',
        modelo: '2019',
        cupos_disponibles: 2,
        cupos_totales: 4
      }
    ];
    
    setViajes(viajesSimulados);
    setLoading(false);
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const handleBuscar = () => {
    cargarViajes();
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      origen: '',
      destino: '',
      fecha: ''
    });
    cargarViajes();
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
            <Link to="/viajes" className="nav-link active">
              🚗 Viajes Disponibles
            </Link>
            <Link to="/mis-reservas" className="nav-link">
              📋 Mis Reservas
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

      {/* Main Content */}
      <div className="main-content">
        <div className="viajes-header">
          <h1>Viajes Disponibles</h1>
          <p>Encuentra el viaje perfecto para tu destino</p>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtros-grid">
            <div className="form-group">
              <label htmlFor="origen">Origen</label>
              <input
                type="text"
                id="origen"
                name="origen"
                value={filtros.origen}
                onChange={handleFiltroChange}
                placeholder="¿Desde dónde?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="destino">Destino</label>
              <input
                type="text"
                id="destino"
                name="destino"
                value={filtros.destino}
                onChange={handleFiltroChange}
                placeholder="¿Hacia dónde vas?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={filtros.fecha}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
          
          <div className="filtros-actions">
            <button onClick={handleBuscar} className="btn-primary">
              🔍 Buscar
            </button>
            <button onClick={handleLimpiarFiltros} className="btn-secondary">
              🗑️ Limpiar
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Lista de viajes */}
        <div className="viajes-grid">
          {viajes.length === 0 ? (
            <div className="no-results">
              <h3>No se encontraron viajes</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            viajes.map(viaje => (
              <div key={viaje.id_viaje} className="viaje-card">
                <div className="viaje-header">
                  <h3>{viaje.origen} → {viaje.destino}</h3>
                  <span className="viaje-precio">${viaje.tarifa.toLocaleString()}</span>
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
                </div>
                
                <div className="viaje-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => navigate(`/viajes/${viaje.id_viaje}`)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaViajes;
