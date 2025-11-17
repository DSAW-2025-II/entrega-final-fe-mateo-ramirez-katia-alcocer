import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service.js";
import UserInfo from './UserInfo.jsx';
import "../App.css";

const MenuPasajero = () => {
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
              <Link to="/viajes" className="nav-link">
                🚗 Viajes Disponibles
              </Link>
              <Link to="/mis-reservas" className="nav-link">
                📋 Mis Reservas
              </Link>
          <Link to="/registrar-vehiculo" className="nav-link">
            🚙 Añadir Vehículo
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
          <p>Aquí podrás gestionar tus viajes como pasajero.</p>
        </div>
        
        <div className="quick-actions">
          <div className="action-card">
            <h3>🚗 Buscar Viajes</h3>
            <p>Encuentra viajes disponibles para tu destino</p>
            <Link to="/viajes" className="btn-primary">Ver Viajes</Link>
          </div>
          
              <div className="action-card">
                <h3>🚙 Ser Conductor</h3>
                <p>Registra tu vehículo y ofrece viajes</p>
                <Link to="/registrar-vehiculo" className="btn-secondary">Añadir Vehículo</Link>
              </div>
              
              <div className="action-card">
                <h3>📋 Mis Reservas</h3>
                <p>Gestiona tus reservas como pasajero</p>
                <Link to="/mis-reservas" className="btn-secondary">Ver Reservas</Link>
              </div>
        </div>
      </main>
    </div>
  );
};

export default MenuPasajero;
