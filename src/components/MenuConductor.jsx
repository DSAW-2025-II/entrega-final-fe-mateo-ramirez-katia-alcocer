import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service.js";
import UserInfo from './UserInfo.jsx';
import "../App.css";

const MenuConductor = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    } else {
      const currentUser = authService.getUser();
      setUsuario(currentUser);
    }
  }, [navigate]);

  return (
    <div className="layout">
      <aside className="sidebar">
            <div className="sidebar-header">
              <div className="logo">
                <h2>Wheels</h2>
              </div>
            </div>
            <nav>
              <Link to="/menu" className="nav-link">
                🏠 Inicio
              </Link>
              <Link to="/viajes/crear" className="nav-link">
                ➕ Crear Viaje
              </Link>
              <Link to="/mis-viajes" className="nav-link">
                🗺️ Mis Viajes
              </Link>
            <Link to="/viajes" className="nav-link">
              🚗 Viajes Disponibles
            </Link>
            <Link to="/mis-reservas" className="nav-link">
              📋 Mis Reservas
            </Link>
            <Link to="/gestionar-solicitudes" className="nav-link">
              📥 Gestionar Solicitudes
            </Link>
            <Link to="/mis-vehiculos" className="nav-link">
              🚙 Mis Vehículos
            </Link>
            <Link to="/perfil" className="nav-link">
              👤 Mi Perfil
            </Link>
            </nav>
        
        <UserInfo onLogout={() => navigate('/login')} />
      </aside>

      <main className="main-content">
        <div className="welcome-section">
          <h1>¡Bienvenido, {usuario?.nombre}!</h1>
          <p>Aquí podrás gestionar tus viajes como conductor.</p>
        </div>
        
            <div className="quick-actions">
              <div className="action-card">
                <h3>➕ Crear Nuevo Viaje</h3>
                <p>Ofrece un viaje a la comunidad universitaria</p>
                <Link to="/viajes/crear" className="btn-primary">Crear Viaje</Link>
              </div>
              
              <div className="action-card">
                <h3>🗺️ Ver Mis Viajes</h3>
                <p>Administra tus viajes activos y pasados</p>
                <Link to="/mis-viajes" className="btn-secondary">Ver Viajes</Link>
              </div>
              
              <div className="action-card">
                <h3> Gestionar Solicitudes</h3>
                <p>Revisa y gestiona las solicitudes de reserva</p>
                <Link to="/gestionar-solicitudes" className="btn-primary">Ver Solicitudes</Link>
              </div>
              
              <div className="action-card">
                <h3>🚗 Buscar Viajes</h3>
                <p>Encuentra viajes disponibles como pasajero</p>
                <Link to="/viajes" className="btn-primary">Ver Viajes</Link>
              </div>
              
              <div className="action-card">
                <h3>📋 Mis Reservas</h3>
                <p>Gestiona tus reservas como pasajero</p>
                <Link to="/mis-reservas" className="btn-secondary">Ver Reservas</Link>
              </div>
              
              <div className="action-card">
                <h3>🚙 Mis Vehículos</h3>
                <p>Gestiona tus vehículos registrados</p>
                <Link to="/mis-vehiculos" className="btn-secondary">Ver Vehículos</Link>
              </div>
            </div>
      </main>
    </div>
  );
};

export default MenuConductor;
