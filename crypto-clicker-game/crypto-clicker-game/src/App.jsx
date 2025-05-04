import { useState } from 'react';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(null);

  const handleWelcomeFinish = () => {
    setShowWelcome(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowWelcome(true); // after logout, show Welcome again
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