import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://entrega-final-be-mateo-ramirez-katia.onrender.com/api';

class RolService {
  async getRolesByUserId(id_usuario) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/roles/usuario/${id_usuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return { success: true, data: response.data.roles };
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al obtener roles' 
      };
    }
  }
}

export default new RolService();
