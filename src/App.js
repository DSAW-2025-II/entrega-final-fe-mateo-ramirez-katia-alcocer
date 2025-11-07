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

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    axios
      .get("https://bewheels.onrender.com/")
      .then((res) => setMensaje(res.data))
      .catch(() => setMensaje("No se pudo conectar con el servidor"));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Wheels - Carpooling Universitario</h1>
              <p>{mensaje}</p>
              <div style={{ marginTop: "20px" }}>
                <a href="/login" style={{ marginRight: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", textDecoration: "none", borderRadius: "5px" }}>
                  Iniciar Sesión
                </a>
                <a href="/registro" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", textDecoration: "none", borderRadius: "5px" }}>
                  Registrarse
                </a>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
            <Route path="/menu" element={<MenuPrincipal />} />
            <Route path="/menu-pasajero" element={<MenuPasajero />} />
            <Route path="/menu-conductor" element={<MenuConductor />} />
            <Route path="/viajes" element={<ListaViajes />} />
            <Route path="/viajes/crear" element={<CrearViaje />} />
            <Route path="/mis-viajes" element={<MisViajes />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/gestionar-solicitudes" element={<GestionarSolicitudes />} />
            <Route path="/mis-vehiculos" element={<MisVehiculos />} />
            <Route path="/registrar-vehiculo" element={<RegistrarVehiculo />} />
            <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;