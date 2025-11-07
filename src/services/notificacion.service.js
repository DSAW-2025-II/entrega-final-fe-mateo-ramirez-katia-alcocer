import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

class NotificacionService {
  async listarNotificaciones() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.get(
        `${API_BASE_URL}/notificaciones`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al listar notificaciones:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar notificaciones'
      };
    }
  }

  async contarNoLeidas() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.get(
        `${API_BASE_URL}/notificaciones/no-leidas/count`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.count };
    } catch (error) {
      console.error('Error al contar notificaciones no leídas:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al contar notificaciones'
      };
    }
  }

  async marcarComoLeida(id_notificacion) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.put(
        `${API_BASE_URL}/notificaciones/${id_notificacion}/leida`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.notificacion };
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al marcar notificación'
      };
    }
  }

  async marcarTodasComoLeidas() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.put(
        `${API_BASE_URL}/notificaciones/todas/leidas`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al marcar notificaciones'
      };
    }
  }
}

export default new NotificacionService();