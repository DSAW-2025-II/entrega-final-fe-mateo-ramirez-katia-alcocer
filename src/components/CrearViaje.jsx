import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import viajeService from '../services/viaje.service.js';
import vehiculoService from '../services/vehiculo.service.js';
import '../App.css';

const CrearViaje = () => {
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    fecha_salida: '',
    cupos_totales: '',
    tarifa: '',
    id_vehiculo: ''
  });
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacion = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      // Cargar vehículos del usuario
      const result = await vehiculoService.listarVehiculosUsuario();
      if (result.success) {
        setVehiculos(result.data);
        if (result.data.length > 0) {
          setFormData(prev => ({ ...prev, id_vehiculo: result.data[0].id_vehiculo }));
        } else {
          setError('No tienes vehículos registrados. Registra un vehículo primero para crear viajes.');
        }
      } else {
        setError(result.error || 'Error al cargar vehículos.');
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones completas
    if (!formData.origen || !formData.destino || !formData.fecha_salida || formData.cupos_totales === '' || formData.tarifa === '' || !formData.id_vehiculo) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (formData.origen.trim() === '' || formData.destino.trim() === '') {
      setError('El origen y destino no pueden estar vacíos');
      setLoading(false);
      return;
    }

    if (formData.origen === formData.destino) {
      setError('El origen y destino no pueden ser iguales');
      setLoading(false);
      return;
    }

    if (new Date(formData.fecha_salida) <= new Date()) {
      setError('La fecha de salida debe ser futura');
      setLoading(false);
      return;
    }

    const cupos = parseInt(formData.cupos_totales);
    if (isNaN(cupos) || cupos < 1 || cupos > 6) {
      setError('Los cupos deben estar entre 1 y 6 personas');
      setLoading(false);
      return;
    }

    const tarifa = parseInt(formData.tarifa);
    if (isNaN(tarifa) || tarifa <= 0) {
      setError('La tarifa debe ser mayor a $0');
      setLoading(false);
      return;
    }
    if (tarifa < 1000) {
      setError('La tarifa mínima es $1,000');
      setLoading(false);
      return;
    }

    const result = await viajeService.crearViaje({
      ...formData,
      cupos_totales: parseInt(formData.cupos_totales),
      tarifa: parseInt(formData.tarifa)
    });
    
    if (result.success) {
      alert('Viaje creado con éxito');
      navigate('/mis-viajes');
    } else {
      setError(result.error || 'Error desconocido al crear viaje');
    }
    
    setLoading(false);
  };

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
            <Link to="/viajes/crear" className="nav-link active">
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
        <div className="form-container">
          <h1>Crear Nuevo Viaje</h1>
          <p>Completa los datos de tu viaje</p>
          
          {error && <div className="error-message">{error}</div>}
          
          {vehiculos.length === 0 ? (
            <div className="no-results">
              <h3>No tienes vehículos registrados</h3>
              <p>Registra un vehículo primero para crear viajes</p>
              <button onClick={() => navigate('/registrar-vehiculo')} className="btn-primary" style={{marginTop: '1rem'}}>
                Registrar Vehículo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="origen">Origen</label>
            <input
              type="text"
              id="origen"
              name="origen"
              value={formData.origen}
              onChange={handleChange}
              placeholder="¿Desde dónde sales?"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="destino">Destino</label>
            <input
              type="text"
              id="destino"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              placeholder="¿Hacia dónde vas?"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fecha_salida">Fecha y Hora de Salida</label>
            <input
              type="datetime-local"
              id="fecha_salida"
              name="fecha_salida"
              value={formData.fecha_salida}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cupos_totales">Cupos Disponibles</label>
            <select
              id="cupos_totales"
              name="cupos_totales"
              value={formData.cupos_totales}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona cupos</option>
              <option value="1">1 pasajero</option>
              <option value="2">2 pasajeros</option>
              <option value="3">3 pasajeros</option>
              <option value="4">4 pasajeros</option>
              <option value="5">5 pasajeros</option>
              <option value="6">6 pasajeros</option>
            </select>
            <small>Máximo 6 pasajeros</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="tarifa">Tarifa por Pasajero ($)</label>
            <input
              type="number"
              id="tarifa"
              name="tarifa"
              value={formData.tarifa}
              onChange={handleChange}
              min="1000"
              step="100"
              placeholder="1000"
              required
            />
            <small>Tarifa mínima: $1,000</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="id_vehiculo">Vehículo</label>
            <select
              id="id_vehiculo"
              name="id_vehiculo"
              value={formData.id_vehiculo}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos.map(vehiculo => (
                <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                  {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa} (Capacidad: {vehiculo.capacidad})
                </option>
              ))}
            </select>
            <small>Selecciona el vehículo para este viaje</small>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/registrar-vehiculo')} className="btn-secondary">
              ➕ Añadir Vehículo
            </button>
            <button type="button" onClick={() => navigate('/menu-conductor')} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading || vehiculos.length === 0}>
              {loading ? 'Creando viaje...' : 'Crear Viaje'}
            </button>
          </div>
        </form>
          )}
        </div>
      </div>
    </div>
);
};

export default CrearViaje;
