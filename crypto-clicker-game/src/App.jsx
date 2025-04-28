import { useState } from 'react';
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); // Clear user and go back to login screen
  };

  return (
    <>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Game user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;