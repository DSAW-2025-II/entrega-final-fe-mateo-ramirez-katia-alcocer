import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://entrega-final-be-mateo-ramirez-katia.onrender.com/api';

class ReservaService {
  async crearReserva(datosReserva) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.post(
        `${API_BASE_URL}/reservas`,
        datosReserva,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.reserva };
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear reserva'
      };
    }
  }

  async listarMisReservas() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.get(
        `${API_BASE_URL}/reservas/mis-reservas`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al listar reservas:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar reservas'
      };
    }
  }

  async listarSolicitudesConductor() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.get(
        `${API_BASE_URL}/reservas/solicitudes-conductor`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al listar solicitudes del conductor:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar solicitudes'
      };
    }
  }

  async listarReservasDelViaje(id_viaje) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.get(
        `${API_BASE_URL}/reservas/viaje/${id_viaje}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al listar reservas del viaje:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar reservas del viaje'
      };
    }
  }

  async aceptarReserva(id_reserva) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.put(
        `${API_BASE_URL}/reservas/${id_reserva}/aceptar`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.reserva };
    } catch (error) {
      console.error('Error al aceptar reserva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al aceptar reserva'
      };
    }
  }

  async rechazarReserva(id_reserva) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.put(
        `${API_BASE_URL}/reservas/${id_reserva}/rechazar`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.reserva };
    } catch (error) {
      console.error('Error al rechazar reserva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al rechazar reserva'
      };
    }
  }

  async cancelarReserva(id_reserva) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.put(
        `${API_BASE_URL}/reservas/${id_reserva}/cancelar`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.reserva };
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cancelar reserva'
      };
    }
  }

  async eliminarReserva(id_reserva) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.delete(
        `${API_BASE_URL}/reservas/${id_reserva}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.reserva };
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar reserva'
      };
    }
  }
}

export default new ReservaService();