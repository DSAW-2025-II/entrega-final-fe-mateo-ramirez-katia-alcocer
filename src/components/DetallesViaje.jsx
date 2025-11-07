import React from 'react';
import '../App.css';

const DetallesViaje = ({ viaje, onCerrar, onReservar }) => {
  if (!viaje) return null;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content detalles-viaje-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del Viaje</h2>
          <button className="modal-close" onClick={onCerrar}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="detalle-section">
            <h3>🗺️ Ruta</h3>
            <div className="ruta-info">
              <div className="punto-ruta">
                <span className="icono-punto origen">📍</span>
                <div>
                  <strong>Origen:</strong>
                  <p>{viaje.origen}</p>
                </div>
              </div>
              <div className="flecha-ruta">➡️</div>
              <div className="punto-ruta">
                <span className="icono-punto destino">🎯</span>
                <div>
                  <strong>Destino:</strong>
                  <p>{viaje.destino}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detalle-section">
            <h3>📅 Fecha y Hora</h3>
            <p className="fecha-completa">{formatearFecha(viaje.fecha_salida)}</p>
          </div>

          <div className="detalle-section">
            <h3>👤 Conductor</h3>
            <div className="conductor-info">
              <div className="conductor-avatar">
                <span className="avatar-placeholder">👤</span>
              </div>
              <div className="conductor-datos">
                <p><strong>Nombre:</strong> {viaje.nombre_conductor}</p>
                {viaje.telefono && (
                  <p><strong>Teléfono:</strong> {viaje.telefono}</p>
                )}
              </div>
            </div>
          </div>

          <div className="detalle-section">
            <h3>🚗 Vehículo</h3>
            <div className="vehiculo-info">
              <p><strong>Marca y Modelo:</strong> {viaje.marca} {viaje.modelo}</p>
              <p><strong>Placa:</strong> {viaje.placa}</p>
            </div>
          </div>

          <div className="detalles-grid">
            <div className="detalle-item">
              <span className="detalle-label">🪑 Cupos</span>
              <span className="detalle-valor">
                {viaje.cupos_disponibles} de {viaje.cupos_totales} disponibles
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">💲 Tarifa</span>
              <span className="detalle-valor precio">
                ${viaje.tarifa?.toLocaleString()}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">📊 Estado</span>
              <span className={`detalle-valor estado ${viaje.estado?.toLowerCase()}`}>
                {viaje.estado}
              </span>
            </div>
          </div>

          {viaje.descripcion && (
            <div className="detalle-section">
              <h3>📝 Información Adicional</h3>
              <p>{viaje.descripcion}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
          {viaje.cupos_disponibles > 0 && viaje.estado === 'Activo' && onReservar && (
            <button className="btn-primary" onClick={() => onReservar(viaje)}>
              🎫 Reservar Cupo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesViaje;