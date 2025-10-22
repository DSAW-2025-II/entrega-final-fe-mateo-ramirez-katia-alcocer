import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [mensaje, setMensaje] = useState("Cargando...");

  useEffect(() => {
    axios
      .get("https://bewheels.onrender.com/")
      .then((res) => setMensaje(res.data))
      .catch((err) => {
        console.error("Error al conectar con el backend:", err);
        setMensaje("No se pudo conectar con el servidor ");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>Frontend Wheels </h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;

