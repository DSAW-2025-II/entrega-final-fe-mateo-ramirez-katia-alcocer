import React, { useState, useEffect, useRef } from 'react';
import ubicacionService from '../services/ubicacion.service.js';

const UbicacionSelector = ({ value, onChange, placeholder, name, required = false }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filteredUbicaciones, setFilteredUbicaciones] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [loading, setLoading] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    // Filtrar ubicaciones basado en el input
    if (inputValue) {
      const filtered = ubicaciones.filter(ubicacion =>
        ubicacion.nombre.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredUbicaciones(filtered);
    } else {
      setFilteredUbicaciones(ubicaciones);
    }
  }, [inputValue, ubicaciones]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cargarUbicaciones = async () => {
    setLoading(true);
    const result = await ubicacionService.listarUbicaciones();
    if (result.success) {
      setUbicaciones(result.data);
      setFilteredUbicaciones(result.data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ target: { name, value: newValue } });
    setShowDropdown(true);
  };

  const handleSelectUbicacion = (ubicacion) => {
    setInputValue(ubicacion.nombre);
    onChange({ target: { name, value: ubicacion.nombre } });
    setShowDropdown(false);
  };

  const handleCrearNuevaUbicacion = async () => {
    if (!inputValue.trim()) return;

    setCreatingNew(true);
    const result = await ubicacionService.buscarOCrearUbicacion(inputValue.trim());
    
    if (result.success) {
      // Actualizar lista de ubicaciones
      await cargarUbicaciones();
      // Seleccionar la nueva ubicación
      setInputValue(result.data.nombre);
      onChange({ target: { name, value: result.data.nombre } });
      setShowDropdown(false);
    }
    setCreatingNew(false);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const ubicacionExacta = filteredUbicaciones.find(
    u => u.nombre.toLowerCase() === inputValue.toLowerCase()
  );

  const mostrarOpcionCrear = inputValue.trim() && !ubicacionExacta && inputValue.trim().length >= 3;

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '1rem',
          backgroundColor: 'white'
        }}
      />
      
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? (
            <div style={{ padding: '0.75rem', textAlign: 'center', color: '#666' }}>
              Cargando ubicaciones...
            </div>
          ) : (
            <>
              {filteredUbicaciones.length > 0 ? (
                filteredUbicaciones.map((ubicacion) => (
                  <div
                    key={ubicacion.id_ubicacion}
                    onClick={() => handleSelectUbicacion(ubicacion)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    📍 {ubicacion.nombre}
                  </div>
                ))
              ) : inputValue ? (
                <div style={{ padding: '0.75rem', color: '#666', textAlign: 'center' }}>
                  No se encontraron ubicaciones
                </div>
              ) : (
                <div style={{ padding: '0.75rem', color: '#666', textAlign: 'center' }}>
                  Escribe para buscar ubicaciones
                </div>
              )}
              
              {mostrarOpcionCrear && (
                <div
                  onClick={handleCrearNuevaUbicacion}
                  style={{
                    padding: '0.75rem',
                    cursor: creatingNew ? 'not-allowed' : 'pointer',
                    borderTop: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa',
                    fontWeight: '500',
                    color: creatingNew ? '#666' : '#667eea',
                    opacity: creatingNew ? 0.6 : 1
                  }}
                >
                  {creatingNew ? (
                    '⏳ Agregando ubicación...'
                  ) : (
                    `➕ Agregar "${inputValue}" como nueva ubicación`
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UbicacionSelector;