import { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Game from './components/Game';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowSignup(false);
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
      {!user ? (
        showSignup ? (
          <>
            <Signup onSignup={setUser} />
            <p style={{ color: 'white' }}>
              Already have an account?{' '}
              <button onClick={() => setShowSignup(false)}>Log in</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={setUser} />
            <p style={{ color: 'white' }}>
              Don’t have an account?{' '}
              <button onClick={() => setShowSignup(true)}>Sign up</button>
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