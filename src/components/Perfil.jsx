import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service.js';
import { getImageUrl } from '../utils/imageUtils.js';
import '../App.css';

const Perfil = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError('');
      const res = await authService.getProfile();
      if (res.success) {
        setPerfil(res.data);
        if (res.data?.foto_perfil) {
          setPreviewUrl(getImageUrl(res.data.foto_perfil));
        }
      } else {
        // Si falla el endpoint específico, usar el usuario del almacenamiento local como fallback
        const user = authService.getUser();
        if (user) {
          setPerfil(user);
          if (user?.foto_perfil) {
            setPreviewUrl(getImageUrl(user.foto_perfil));
          }
        }
        setError(res.error);
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));
  };

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    setFotoFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validar contraseñas si se quiere cambiar
    if (changePassword) {
      if (!newPassword) {
        setError('Debes ingresar la nueva contraseña');
        setSaving(false);
        return;
      }
      if (newPassword.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setSaving(false);
        return;
      }
    }

    const payload = { ...perfil };
    if (fotoFile) payload.foto_perfil = fotoFile;
    if (changePassword && newPassword) payload.contrasena = newPassword;

    const res = await authService.updateProfile(payload);
    if (res.success) {
      setPerfil(res.data);
      setSuccess('Perfil actualizado correctamente');
      setFotoFile(null);
      setNewPassword('');
      setConfirmPassword('');
      setChangePassword(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.error || 'No se pudo actualizar el perfil');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="loading-container">
        <p>No se pudo cargar el perfil del usuario.</p>
      </div>
    );
  }

  const handleNavClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>Wheels</h2>
          </div>
        </div>
        <nav>
          <Link to="/menu" className="nav-link" onClick={handleNavClick}>
            🏠 Inicio
          </Link>
          <Link to="/viajes" className="nav-link" onClick={handleNavClick}>
            🚗 Viajes Disponibles
          </Link>
          <Link to="/mis-reservas" className="nav-link" onClick={handleNavClick}>
            📋 Mis Reservas
          </Link>
          <Link to="/mis-vehiculos" className="nav-link" onClick={handleNavClick}>
            🚙 Mis Vehículos
          </Link>
          <Link to="/perfil" className="nav-link active" onClick={handleNavClick}>
            👤 Mi Perfil
          </Link>
        </nav>
        <div className="user-info">
          <div className="user-avatar">
            {perfil?.foto_perfil ? (
              <img 
                src={getImageUrl(perfil.foto_perfil)} 
                alt="Avatar" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          <p className="user-name">{perfil?.nombre}</p>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="welcome-section">
          <h1>Mi Perfil</h1>
          <p>Consulta y edita tu información personal</p>
        </div>

        <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message" style={{ 
              color:'#2f855a', 
              background:'#f0fff4', 
              border:'1px solid #9ae6b4', 
              borderRadius:'8px', 
              padding:'0.75rem 1rem', 
              textAlign:'center', 
              marginBottom:'1.5rem',
              fontWeight: '500'
            }}>
              ✓ {success}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
            {/* Columna izquierda: Vista previa de foto */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Foto de perfil</h3>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                overflow: 'hidden',
                background: '#f1f3f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #667eea'
              }}>
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      setPreviewUrl('');
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '4rem', color: '#667eea' }}>👤</span>
                )}
              </div>
              <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                📷 Cambiar foto
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFoto} 
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Columna derecha: Formulario */}
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Información personal</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input 
                    name="nombre" 
                    value={perfil.nombre || ''} 
                    onChange={handleChange} 
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>ID Universitario</label>
                  <input 
                    name="id_universitario" 
                    value={perfil.id_universitario || ''} 
                    onChange={handleChange} 
                    placeholder="Tu ID universitario"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Correo institucional</label>
                  <input 
                    name="correo" 
                    value={perfil.correo || ''} 
                    disabled 
                    style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem' }}>
                    El correo institucional no se puede cambiar
                  </small>
                </div>
                
                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    name="telefono" 
                    value={perfil.telefono || ''} 
                    onChange={handleChange} 
                    placeholder="Tu teléfono"
                    type="tel"
                    required
                  />
                </div>

                {/* Sección para cambiar contraseña */}
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      checked={changePassword}
                      onChange={(e) => {
                        setChangePassword(e.target.checked);
                        if (!e.target.checked) {
                          setNewPassword('');
                          setConfirmPassword('');
                        }
                      }}
                    />
                    Cambiar contraseña
                  </label>
                </div>

                {changePassword && (
                  <>
                    <div className="form-group">
                      <label>Nueva contraseña</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Ingresa tu nueva contraseña"
                          minLength={8}
                          style={{ paddingRight: '40px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      <small style={{ color: '#666', fontSize: '0.85rem' }}>
                        Mínimo 8 caracteres
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Confirmar nueva contraseña</label>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        minLength={8}
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="btn-success" disabled={saving} style={{ marginTop: '1rem' }}>
                  {saving ? 'Guardando...' : '💾 Guardar cambios'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
