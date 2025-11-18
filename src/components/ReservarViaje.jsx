import React, { useState } from 'react';
import reservaService from '../services/reserva.service.js';
import UbicacionSelector from './UbicacionSelector.jsx';

const ReservarViaje = ({ viaje, onClose, onReservaCreada }) => {
  const [formData, setFormData] = useState({
    cupos_reservados: 1,
    punto_recogida: '',
    punto_destino: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.punto_recogida.trim()) {
      setError('Debes especificar el punto de recogida');
      setLoading(false);
      return;
    }

    const datosReserva = {
      id_viaje: viaje.id_viaje,
      cupos_reservados: parseInt(formData.cupos_reservados),
      punto_recogida: formData.punto_recogida.trim(),
      punto_destino: formData.punto_destino.trim() || null
    };

    const result = await reservaService.crearReserva(datosReserva);
    
    if (result.success) {
      onReservaCreada?.();
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const generarOpcionesCupos = () => {
    const opciones = [];
    const maxCupos = Math.min(viaje.cupos_disponibles, 4); // Máximo 4 cupos por reserva
    
    for (let i = 1; i <= maxCupos; i++) {
      opciones.push(
        <option key={i} value={i}>
          {i} {i === 1 ? 'cupo' : 'cupos'}
        </option>
      );
    }
    
    return opciones;
  };

  if (!viaje) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reservar Viaje</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {/* Información del viaje */}
          <div className="viaje-info">
            <h3>📍 {viaje.origen} → {viaje.destino}</h3>
            <div className="viaje-details">
              <p><strong>📅 Fecha:</strong> {new Date(viaje.fecha_salida).toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>👤 Conductor:</strong> {viaje.nombre_conductor}</p>
              <p><strong>🚗 Vehículo:</strong> {viaje.marca} {viaje.modelo} - {viaje.placa}</p>
              <p><strong>💰 Tarifa:</strong> ${viaje.tarifa?.toLocaleString('es-CO')} por persona</p>
              <p><strong>📋 Cupos disponibles:</strong> {viaje.cupos_disponibles}</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="reserva-form">
            <div className="form-group">
              <label htmlFor="cupos_reservados">Número de cupos a reservar</label>
              <select
                id="cupos_reservados"
                name="cupos_reservados"
                value={formData.cupos_reservados}
                onChange={handleChange}
                required
              >
                {generarOpcionesCupos()}
              </select>
              <small>Cupos disponibles: {viaje.cupos_disponibles}</small>
            </div>

            <div className="form-group">
              <label htmlFor="punto_recogida">Punto de recogida *</label>
              <UbicacionSelector
                name="punto_recogida"
                value={formData.punto_recogida}
                onChange={handleChange}
                placeholder="¿Dónde quieres que te recojan? (ej: Universidad de La Sabana - Puerta Principal)"
                required
              />
              <small>Especifica el lugar exacto donde el conductor debe recogerte</small>
            </div>

            <div className="form-group">
              <label htmlFor="punto_destino">Punto de destino (opcional)</label>
              <UbicacionSelector
                name="punto_destino"
                value={formData.punto_destino}
                onChange={handleChange}
                placeholder="¿Dónde te van a dejar? (opcional)"
              />
              <small>Si es diferente al destino principal del viaje</small>
            </div>

            <div className="total-costo">
              <h3>💰 Total a pagar: ${(viaje.tarifa * formData.cupos_reservados)?.toLocaleString('es-CO')}</h3>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-warning">
                Cancelar
              </button>
              <button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Enviando solicitud...' : '🚗 Reservar cupos'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservarViaje;