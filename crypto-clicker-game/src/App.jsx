import { useState } from 'react';
import Welcome from './components/Welcome'; // <-- Import Welcome page
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [showWelcome, setShowWelcome] = useState(true); // <-- Show Welcome first
  const [user, setUser] = useState(null);

  const handleWelcomeFinish = () => {
    setShowWelcome(false); // After 10 seconds, move to Login
  };

  const handleLogout = () => {
    setUser(null);
    setShowWelcome(true); // After logout, show Welcome again
  };

  return (
    <>
      {showWelcome ? (
        <Welcome onFinish={handleWelcomeFinish} />
      ) : !user ? (
        <Login onLogin={setUser} />
      ) : (
        <Game user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;