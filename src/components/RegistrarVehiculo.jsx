import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service.js';
import vehiculoService from '../services/vehiculo.service.js';
import UserInfo from './UserInfo.jsx';
import '../App.css';

const RegistrarVehiculo = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    capacidad: '',
    foto: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'foto') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones del frontend
    if (!formData.placa || !formData.marca || !formData.modelo || !formData.capacidad || !formData.foto) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    // Validar formato de placa (3 letras + 3 números)
    const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
    if (!placaRegex.test(formData.placa.toUpperCase())) {
      setError('La placa debe tener 3 letras seguidas de 3 números (ej: ABC123)');
      setLoading(false);
      return;
    }

    // Validar año del vehículo (modelo)
    const añoActual = new Date().getFullYear();
    const añoVehiculo = parseInt(formData.modelo);
    if (añoVehiculo < 2010 || añoVehiculo > añoActual) {
      setError(`El año del vehículo debe estar entre 2010 y ${añoActual}`);
      setLoading(false);
      return;
    }

    // Validar capacidad
    if (formData.capacidad < 1 || formData.capacidad > 6) {
      setError('La capacidad debe estar entre 1 y 6 personas');
      setLoading(false);
      return;
    }

    console.log('Datos del vehículo:', formData);

    const result = await vehiculoService.registrarVehiculo(formData);

    if (result.success) {
      alert('Vehículo registrado exitosamente. Ahora eres conductor.');
      navigate('/menu-conductor');
    } else {
      setError(result.error || 'Error desconocido al registrar vehículo');
    }

    setLoading(false);
  };

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
            <Link to="/viajes" className="nav-link" onClick={handleNavClick}>
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

      <div className="main-content">
        <div className="welcome-section">
          <h1>Registrar Vehículo</h1>
          <p>Ingresa los datos de tu vehículo para empezar a ofrecer viajes como conductor.</p>
        </div>

        <div className="form-container">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="vehiculo-form">
            <div className="form-group">
              <label htmlFor="placa">Placa del Vehículo *</label>
              <input
                type="text"
                id="placa"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="ABC123"
                style={{ textTransform: 'uppercase' }}
                required
              />
              <small>Formato: 3 letras + 3 números (ej: ABC123)</small>
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca *</label>
              <select
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una marca</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Nissan">Nissan</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Mazda">Mazda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Renault">Renault</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modelo">Año del Vehículo *</label>
              <select
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona el año</option>
                {Array.from({ length: 16 }, (_, i) => {
                  const año = new Date().getFullYear() - i;
                  return (
                    <option key={año} value={año}>
                      {año}
                    </option>
                  );
                })}
              </select>
              <small>Desde 2010 hasta {new Date().getFullYear()}</small>
            </div>

            <div className="form-group">
              <label htmlFor="capacidad">Capacidad (personas) *</label>
              <select
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona la capacidad</option>
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
                <option value="6">6 personas</option>
              </select>
              <small>Máximo 6 personas</small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="foto">Foto del Vehículo *</label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                required
              />
              <small>Formatos: JPG, PNG, GIF. Máximo 2MB. Campo obligatorio</small>
            </div>

            <div className="form-actions">
              <button type="button" 
                className="btn-danger"
                onClick={() => navigate('/menu')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar Vehículo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarVehiculo;
