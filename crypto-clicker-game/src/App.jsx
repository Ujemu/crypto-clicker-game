import React, { useState } from 'react';
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0e0e10', // Dark background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'white', // Make text readable
      padding: '20px'
    }}>
      {!user ? <Login onLogin={setUser} /> : <Game user={user} />}
    </div>
  );
}

export default App;