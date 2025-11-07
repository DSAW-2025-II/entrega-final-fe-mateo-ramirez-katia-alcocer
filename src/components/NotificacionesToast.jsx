import React, { useState, useEffect } from 'react';
import notificacionService from '../services/notificacion.service.js';

const NotificacionesToast = () => {
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarNotificacionesNoLeidas();
    // Verificar notificaciones cada 30 segundos
    const interval = setInterval(cargarNotificacionesNoLeidas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const cargarNotificacionesNoLeidas = async () => {
    const result = await notificacionService.listarNotificacionesNoLeidas();
    if (result.success) {
      setNotificacionesNoLeidas(result.data);
    }
  };

  const manejarAceptarNotificacion = async (id_notificacion) => {
    setLoading(true);
    const result = await notificacionService.marcarComoLeida(id_notificacion);
    
    if (result.success) {
      // Remover la notificación de la lista
      setNotificacionesNoLeidas(prev => 
        prev.filter(notif => notif.id_notificacion !== id_notificacion)
      );
    } else {
      alert('Error al marcar la notificación: ' + result.error);
    }
    setLoading(false);
  };

  if (notificacionesNoLeidas.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {notificacionesNoLeidas.map((notificacion) => (
        <div key={notificacion.id_notificacion} className="notification-toast">
          <div className="notification-content">
            <div className="notification-header">
              <h4>{notificacion.titulo}</h4>
              <span className="notification-time">
                {new Date(notificacion.fecha_envio).toLocaleString('es-CO', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="notification-message">{notificacion.mensaje}</p>
            <div className="notification-actions">
              <button 
                onClick={() => manejarAceptarNotificacion(notificacion.id_notificacion)}
                disabled={loading}
                className="btn-accept-notification"
              >
                {loading ? 'Procesando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .notifications-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          max-width: 400px;
        }

        .notification-toast {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          margin-bottom: 12px;
          border-left: 4px solid #dc3545;
          animation: slideIn 0.3s ease-out;
          overflow: hidden;
        }

        .notification-content {
          padding: 16px;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .notification-header h4 {
          margin: 0;
          color: #dc3545;
          font-size: 1rem;
          font-weight: 600;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #6c757d;
          white-space: nowrap;
          margin-left: 12px;
        }

        .notification-message {
          margin: 0 0 12px 0;
          color: #495057;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .notification-actions {
          display: flex;
          justify-content: flex-end;
        }

        .btn-accept-notification {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-accept-notification:hover:not(:disabled) {
          background: #218838;
        }

        .btn-accept-notification:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .notifications-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificacionesToast;