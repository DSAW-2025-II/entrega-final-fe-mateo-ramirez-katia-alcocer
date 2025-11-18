import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';
import '../App.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    id_universitario: '',
    correo: '',
    telefono: '',
    contrasena: '',
    foto_perfil: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'foto_perfil') {
      setFormData({
        ...formData,
        foto_perfil: e.target.files[0],
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
    if (!formData.nombre || !formData.id_universitario || !formData.correo || !formData.telefono || !formData.contrasena) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (!formData.correo.includes('@unisabana.edu.co')) {
      setError('El correo debe ser institucional (@unisabana.edu.co)');
      setLoading(false);
      return;
    }

    if (formData.contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    const result = await authService.register(formData);

    if (result.success) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } else {
      setError(result.error || 'Error desconocido al registrarse');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registrarse</h1>
        <p>Crea tu cuenta en Wheels</p>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_universitario">ID Universitario *</label>
            <input
              type="text"
              id="id_universitario"
              name="id_universitario"
              value={formData.id_universitario}
              onChange={handleChange}
              placeholder="Ej: 12345678"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Institucional *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu.correo@unisabana.edu.co"
              required
            />
            <small>Debe terminar en @unisabana.edu.co</small>
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="3001234567"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña *</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              required
            />
            <small>Mínimo 8 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="foto_perfil">Foto de Perfil (Opcional)</label>
            <input
              type="file"
              id="foto_perfil"
              name="foto_perfil"
              accept="image/*"
              onChange={handleChange}
            />
            <small>Formatos: JPG, PNG, GIF. Máximo 2MB</small>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-links">
          <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
