import { useEffect, useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Game from './components/Game';
import Splash from './components/Splash';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setShowSignup(false);
  };

  // Show splash screen first
  if (showSplash) return <Splash />;

  return (
    <div
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Status Message */}
      <p style={{ color: 'lime', fontWeight: 'bold', textAlign: 'center' }}>
        LIVE BUILD — Email + Username Login Active!
      </p>

      {!user ? (
        showSignup ? (
          <>
            <Signup onSignup={setUser} />
            <p style={{ color: 'white', marginTop: '10px' }}>
              Already have an account?{' '}
              <button
                onClick={() => setShowSignup(false)}
                style={{
                  background: 'none',
                  color: '#00f',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Log in
              </button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={setUser} />
            <p style={{ color: 'white', marginTop: '10px' }}>
              Don’t have an account?{' '}
              <button
                onClick={() => setShowSignup(true)}
                style={{
                  background: 'none',
                  color: '#00f',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Sign up
              </button>
            </p>
          </>
        )
      ) : (
        <Game user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;