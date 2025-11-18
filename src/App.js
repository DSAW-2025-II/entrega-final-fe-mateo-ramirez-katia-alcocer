import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPasajero from "./components/MenuPasajero";
import MenuConductor from "./components/MenuConductor";
import MenuPrincipal from "./components/MenuPrincipal";
import ListaViajes from "./components/ListaViajes";
import CrearViaje from "./components/CrearViaje";
import MisViajes from "./components/MisViajes";
import MisReservas from "./components/MisReservas";
import MisVehiculos from "./components/MisVehiculos";
import GestionarSolicitudes from "./components/GestionarSolicitudes";
import Login from "./components/Login";
import Registro from "./components/Registro";
import RegistrarVehiculo from "./components/RegistrarVehiculo";
import Perfil from "./components/Perfil";
import NotificacionesToast from "./components/NotificacionesToast";
import MobileMenuToggle from "./components/MobileMenuToggle";
import MobileMenuOverlay from "./components/MobileMenuOverlay";
import { useMobileMenu } from "./hooks/useMobileMenu";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isMobileMenuOpen, isMobile, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  useEffect(() => {
    axios
      .get("https://entrega-final-be-mateo-ramirez-katia.onrender.com/")
      .then((res) => setMensaje("API Wheels funcionando"))
      .catch(() => setMensaje("No se pudo conectar con el servidor"));
      
    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      {/* Mostrar notificaciones solo si el usuario está logueado */}
      {isLoggedIn && <NotificacionesToast />}
      
      {/* Botón del menú móvil - solo en páginas con sidebar */}
      {isLoggedIn && isMobile && (
        <>
          <MobileMenuToggle 
            isOpen={isMobileMenuOpen} 
            onToggle={toggleMobileMenu} 
          />
          <MobileMenuOverlay 
            isOpen={isMobileMenuOpen} 
            onClose={closeMobileMenu} 
          />
        </>
      )}
      
      <Routes>
        <Route
          path="/"
          element={
            <div className="auth-container">
              <div className="auth-card welcome-card">
                <div className="welcome-logo">🚗</div>
                <h1>Wheels</h1>
                <p className="welcome-subtitle">Carpooling Universitario</p>
                <p className="welcome-status">{mensaje}</p>
                <div className="welcome-buttons">
                  <a href="/login" className="btn-primary welcome-btn">
                    Iniciar Sesión
                  </a>
                  <a href="/registro" className="btn-success welcome-btn">
                    Registrarse
                  </a>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/menu" element={
          <MenuPrincipal 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/menu-pasajero" element={
          <MenuPasajero 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/menu-conductor" element={
          <MenuConductor 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/viajes" element={
          <ListaViajes 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/viajes/crear" element={
          <CrearViaje 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/mis-viajes" element={
          <MisViajes 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/mis-reservas" element={
          <MisReservas 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/gestionar-solicitudes" element={
          <GestionarSolicitudes 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/mis-vehiculos" element={
          <MisVehiculos 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/registrar-vehiculo" element={
          <RegistrarVehiculo 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
        <Route path="/perfil" element={
          <Perfil 
            isMobileMenuOpen={isMobileMenuOpen} 
            onCloseMobileMenu={closeMobileMenu} 
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;