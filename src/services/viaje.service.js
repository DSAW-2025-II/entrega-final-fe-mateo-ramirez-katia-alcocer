import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ;

class ViajeService {
  async crearViaje(datosViaje) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/viajes`, datosViaje, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creando viaje:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al crear viaje' 
      };
    }
  }

  async listarViajesDisponibles(filtros = {}) {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filtros.origen) params.append('origen', filtros.origen);
      if (filtros.destino) params.append('destino', filtros.destino);
      if (filtros.fecha) params.append('fecha', filtros.fecha);

      const response = await axios.get(`${API_BASE_URL}/viajes/disponibles?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error listando viajes disponibles:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener viajes disponibles' 
      };
    }
  }

  async listarMisViajes() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/viajes/mis-viajes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error listando mis viajes:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener mis viajes' 
      };
    }
  }

  async obtenerViaje(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/viajes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo viaje:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener viaje' 
      };
    }
  }

  async actualizarViaje(id, datosViaje) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/viajes/${id}`, datosViaje, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error actualizando viaje:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al actualizar viaje' 
      };
    }
  }

  async cancelarViaje(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/viajes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error cancelando viaje:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al cancelar viaje' 
      };
    }
  }
}

export default new ViajeService();
