import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

class UbicacionService {
  async listarUbicaciones() {
    try {
      const response = await axios.get(`${API_BASE_URL}/ubicaciones`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al listar ubicaciones:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar ubicaciones'
      };
    }
  }

  async crearUbicacion(nombre) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.post(
        `${API_BASE_URL}/ubicaciones`,
        { nombre },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.ubicacion };
    } catch (error) {
      console.error('Error al crear ubicación:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear ubicación'
      };
    }
  }

  async buscarOCrearUbicacion(nombre) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }

      const response = await axios.post(
        `${API_BASE_URL}/ubicaciones/buscar-o-crear`,
        { nombre },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { success: true, data: response.data.ubicacion };
    } catch (error) {
      console.error('Error al buscar/crear ubicación:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al procesar ubicación'
      };
    }
  }
}

export default new UbicacionService();