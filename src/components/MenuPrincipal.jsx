import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';
import vehiculoService from '../services/vehiculo.service.js';
import rolService from '../services/rol.service.js';
import '../App.css';

const MenuPrincipal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verificarUsuario = async () => {
      // Verificar autenticación básica
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        const usuario = authService.getUser();
        
        // Primero verificar roles del usuario
        const rolesResult = await rolService.getRolesByUserId(usuario.id_usuario);
        
        if (rolesResult.success && rolesResult.data && rolesResult.data.length > 0) {
          // Si tiene roles, verificar si es conductor
          const esConductor = rolesResult.data.some(rol => 
            rol.nombre_rol === 'Conductor' && rol.rol_activo === true
          );
          
          if (esConductor) {
            navigate('/menu-conductor', { replace: true });
          } else {
            navigate('/menu-pasajero', { replace: true });
          }
        } else {
          // Si no tiene roles, verificar vehículos como fallback
          const vehiculosResult = await vehiculoService.listarVehiculosUsuario();
          
          if (vehiculosResult.success && vehiculosResult.data && vehiculosResult.data.length > 0) {
            navigate('/menu-conductor', { replace: true });
          } else {
            navigate('/menu-pasajero', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error verificando usuario:', error);
        // En caso de error, ir a pasajero por defecto
        navigate('/menu-pasajero', { replace: true });
      }
    };

    // Ejecutar inmediatamente
    verificarUsuario();
  }, [navigate]);

  return (
    <div className="loading-container">
      <p>Redirigiendo...</p>
    </div>
  );
};

export default MenuPrincipal;
