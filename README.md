# FEWheels - Frontend

Frontend para el proyecto Wheels, una plataforma de carpooling universitario.

## URLs de Producción

**Frontend (Aplicación Web):** `https://entrega-final-fe-mateo-ramirez-kati.vercel.app`

**Backend (API):** `https://entrega-final-be-mateo-ramirez-katia.onrender.com`

---

## Descripción

Aplicación web desarrollada con React que permite a los usuarios de la Universidad de La Sabana:
- Registrarse como pasajeros o conductores
- Crear y gestionar viajes
- Reservar cupos en viajes disponibles
- Gestionar vehículos y perfiles

---

## Tecnologías

- **React** - Framework de JavaScript
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS** - Estilos personalizados

---

## Requisitos

- **Node.js** 18+
- **npm** o **yarn**

---

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=https://entrega-final-be-mateo-ramirez-katia.onrender.com/api
```

---

## Instalación

```bash
npm install
```

---

## Ejecución

### Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
```

Esto generará una carpeta `build` con los archivos optimizados para producción.

---

## Estructura del Proyecto

```
src/
├── components/      # Componentes React
├── services/        # Servicios para comunicación con la API
├── utils/           # Utilidades y helpers
├── hooks/           # Custom hooks
├── App.js           # Componente principal
└── index.js         # Punto de entrada
```

---

## Funcionalidades Principales

- **Autenticación**: Registro, login y gestión de sesión
- **Gestión de Perfil**: Edición de información personal y foto
- **Viajes**: Creación, visualización y gestión de viajes (conductores)
- **Reservas**: Búsqueda y reserva de viajes disponibles (pasajeros)
- **Vehículos**: Registro y gestión de vehículos (conductores)
- **Notificaciones**: Sistema de notificaciones en tiempo real

---

## Integración con Backend

El frontend se comunica con el backend a través de la API REST:

- **Base URL**: `https://entrega-final-be-mateo-ramirez-katia.onrender.com/api`
- **Autenticación**: JWT tokens almacenados en localStorage
- **Endpoints**: Ver documentación del backend para más detalles

---

## Despliegue

La aplicación está desplegada en **Vercel** y se actualiza automáticamente con cada push a la rama `main`.

---

## Autores

- Mateo Ramírez
- Katia Alcocer

---

## Licencia

ISC
