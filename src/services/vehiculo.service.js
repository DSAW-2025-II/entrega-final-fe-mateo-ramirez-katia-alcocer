import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ;

class VehiculoService {
  async listarVehiculosUsuario() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/vehiculos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error listando vehículos del usuario:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener vehículos del usuario' 
      };
    }
  }

  async registrarVehiculo(datosVehiculo) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(datosVehiculo).forEach(key => {
        if (datosVehiculo[key] !== null && datosVehiculo[key] !== undefined) {
          formData.append(key, datosVehiculo[key]);
        }
      });
      
      const response = await axios.post(`${API_BASE_URL}/vehiculos/registro`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error registrando vehículo:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al registrar vehículo' 
      };
    }
  }

  async eliminarVehiculo(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/vehiculos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al eliminar vehículo' 
      };
    }
  }
}

export default new VehiculoService();
