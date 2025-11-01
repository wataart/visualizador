import React, { useState } from 'react';
import { users } from '../dbs/dbU'; 

// --- ÍCONOS PARA EL BOTÓN DE CONTRASEÑA ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);
// ------------------------------------------

// Recibe la función onLoginSuccess como prop
export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Estado para ver/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 

    const foundUser = users.find((u) => u.user.toLowerCase() === username.toLowerCase());

    if (foundUser) {
      if (foundUser.pass === password) {
        // Ya no guardamos la sesión, solo llamamos a la función
        // para actualizar el estado en App.jsx
        onLoginSuccess();
      } else {
        setError('Contraseña incorrecta.');
      }
    } else {
      setError('Usuario no encontrado.');
    }
  };

  // Estilos
  const loginStyles = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#222',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
    color: 'white',
  };

  const inputStyles = {
    width: '100%',
    padding: '0.8rem',
    // Añadimos padding a la derecha para el ícono
    paddingRight: '3rem', 
    margin: '0.5rem 0 1rem 0',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#333',
    color: 'white',
    boxSizing: 'border-box',
  };
  
  // Contenedor para el input y el botón
  const inputContainerStyles = {
    position: 'relative',
    width: '100%',
  };
  
  // Botón posicionado absolutamente dentro del contenedor
  const passwordToggleStyles = {
    position: 'absolute',
    top: '50%',
    right: '0.8rem',
    // Ajuste fino para centrar el botón verticalmente
    // (mitad del input + la mitad del margen superior - mitad del botón)
    transform: 'translateY(calc(-50% + 0.25rem))', 
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  };
  // ----------------------------------------------------

  const buttonStyles = {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={loginStyles}>
      <h1 style={{ textAlign: 'center' }}>Gestor de Cotizaciones</h1>
      <h2 style={{ textAlign: 'center', color: '#ccc', fontWeight: 'normal', marginTop: '-10px', marginBottom: '25px'}}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyles}
          />
        </div>
        
        {/* Contenedor de Contraseña */}
        <div>
          <label htmlFor="password">Contraseña</label>
          <div style={inputContainerStyles}>
            <input
              id="password"
              // El tipo cambia basado en el estado
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyles}
            />
            {/* Botón para ver/ocultar */}
            <button
              type="button" // previene que envíe el formulario
              style={passwordToggleStyles}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        {/* ------------------------------------------- */}
        
        {error && <p style={{ color: '#f87171', textAlign: 'center', margin: '10px 0' }}>{error}</p>}

        <button type="submit" style={buttonStyles}>
          Ingresar
        </button>
      </form>
    </div>
  );
}
