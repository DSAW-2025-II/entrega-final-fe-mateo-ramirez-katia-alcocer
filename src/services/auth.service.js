import axios from 'axios';

const API_BASE_URL = 'https://bewheels-xmjl.onrender.com/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  setupAxios() {
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async login(correo, contrasena) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        correo,
        contrasena
      });

      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      this.token = token;
      this.user = usuario;
      this.setupAxios();
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error completo en login:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  }

  async register(datosUsuario) {
    try {
      const formData = new FormData();
      Object.keys(datosUsuario).forEach(key => {
        if (datosUsuario[key] !== null && datosUsuario[key] !== undefined) {
          formData.append(key, datosUsuario[key]);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/usuarios/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error completo en registro:', error);
      let errorMessage = 'Error al registrarse';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async verificarToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: 'No hay token' };
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_BASE_URL}/auth/verificar-token`);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      return { success: true, usuario: response.data.usuario };
    } catch (error) {
      console.error('Error verificando token:', error);
      this.logout();
      return { success: false, error: 'Token inválido o expirado' };
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    this.token = null;
    this.user = null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return !!token && !!user;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
