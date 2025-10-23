import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import vehiculoService from '../services/vehiculo.service.js';
import '../App.css';

const MisVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
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

      await cargarVehiculos();
    };

    verificarAutenticacion();
  }, [navigate]);

  const cargarVehiculos = async () => {
    setLoading(true);
    const result = await vehiculoService.listarVehiculosUsuario();
    
    if (result.success) {
      setVehiculos(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleEliminarVehiculo = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      const result = await vehiculoService.eliminarVehiculo(id);
      if (result.success) {
        await cargarVehiculos();
        alert('Vehículo eliminado exitosamente');
      } else {
        alert('Error al eliminar el vehículo: ' + result.error);
      }
    }
  };

  if (loading) {
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
            <Link to="/mis-viajes" className="nav-link">
              🗺️ Mis Viajes
            </Link>
            <Link to="/viajes" className="nav-link">
              🚗 Viajes Disponibles
            </Link>
            <Link to="/mis-reservas" className="nav-link">
              📋 Mis Reservas
            </Link>
            <Link to="/registrar-vehiculo" className="nav-link">
              ➕ Añadir Vehículo
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
            <p>Cargando vehículos...</p>
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
          <Link to="/mis-viajes" className="nav-link">
            🗺️ Mis Viajes
          </Link>
          <Link to="/viajes" className="nav-link">
            🚗 Viajes Disponibles
          </Link>
          <Link to="/mis-reservas" className="nav-link">
            📋 Mis Reservas
          </Link>
          <Link to="/registrar-vehiculo" className="nav-link active">
            ➕ Añadir Vehículo
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
          <h1>Mis Vehículos</h1>
          <p>Gestiona tus vehículos registrados</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="vehiculos-header">
          <h2>Vehículos Registrados ({vehiculos.length}/5)</h2>
          <Link to="/registrar-vehiculo" className="btn-primary">
            ➕ Añadir Nuevo Vehículo
          </Link>
        </div>

        {vehiculos.length === 0 ? (
          <div className="no-results">
            <h3>No tienes vehículos registrados</h3>
            <p>Registra tu primer vehículo para empezar a ofrecer viajes</p>
            <Link to="/registrar-vehiculo" className="btn-primary" style={{marginTop: '1rem'}}>
              Registrar Primer Vehículo
            </Link>
          </div>
        ) : (
          <div className="vehiculos-grid">
            {vehiculos.map(vehiculo => (
              <div key={vehiculo.id_vehiculo} className="vehiculo-card">
                <div className="vehiculo-image">
                  {vehiculo.foto ? (
                    <img 
                      src={vehiculo.foto.startsWith('http') ? vehiculo.foto : `http://localhost:3001${vehiculo.foto}`} 
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="vehiculo-placeholder" style={{display: vehiculo.foto ? 'none' : 'flex'}}>
                    🚗
                  </div>
                </div>
                
                <div className="vehiculo-info">
                  <h3>{vehiculo.marca} {vehiculo.modelo}</h3>
                  <p className="vehiculo-placa">{vehiculo.placa}</p>
                  <div className="vehiculo-details">
                    <span className="detail-item">Capacidad: {vehiculo.capacidad} personas</span>
                  </div>
                </div>
                
                <div className="vehiculo-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleEliminarVehiculo(vehiculo.id_vehiculo)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {vehiculos.length > 0 && vehiculos.length < 5 && (
          <div className="add-vehicle-section">
            <Link to="/registrar-vehiculo" className="btn-primary">
              ➕ Añadir Otro Vehículo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MisVehiculos;
