import React, { useState } from 'react';
import Login from './components/login.jsx';   
import Gestor from './Gestor.jsx'; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Estilo para centrar el login
  const appContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    backgroundColor: '#1e1e1e',
  };

  // Esta función se la pasaremos a login.jsx
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Si el usuario NO está logueado, muestra el Login
  if (!isLoggedIn) {
    return (
      <div style={appContainerStyles}>
        <Login onLoginSuccess={handleLogin} />
      </div>
    );
  }

  // Si el usuario SÍ está logueado, muestra el Gestor
  return <Gestor />;
}

