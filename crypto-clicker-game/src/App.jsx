import { useEffect, useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Game from './components/Game';
import Splash from './components/Splash';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false); // for 3-second loading after login/signup

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000); // show splash for 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setLoadingUser(true);
    setTimeout(() => setLoadingUser(false), 3000); // show loading user for 3 seconds
  };

  const handleSignup = (newUser) => {
    setUser(newUser);
    setLoadingUser(true);
    setTimeout(() => setLoadingUser(false), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    setShowSignup(false);
  };

  if (showSplash) return <Splash />;
  if (loadingUser) return <p style={{ color: 'white', textAlign: 'center' }}>Loading user...</p>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
      {!user ? (
        showSignup ? (
          <Signup onSignup={handleSignup} />
        ) : (
          <Login onLogin={handleLogin} onSwitch={() => setShowSignup(true)} />
        )
      ) : (
        <Game user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;