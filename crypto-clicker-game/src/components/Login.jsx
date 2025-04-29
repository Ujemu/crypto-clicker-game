import { useState } from 'react';
import { ref, get, child, set } from 'firebase/database';
import { database } from '../firebase';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const userRef = child(ref(database), players/${cleanUsername});

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          onLogin({ 
            username: cleanUsername,
            isAdmin: userData.isAdmin || false
          });
        } else {
          setError("Incorrect password");
        }
      } else {
        const isAdmin = cleanUsername === "web3degen";
        await set(ref(database, players/${cleanUsername}), {
          username: cleanUsername,
          password: password,
          coins: 0,
          level: 0,
          multiplier: 1,
          autoClickers: 0,
          multiplierCost: 50,
          autoClickerCost: 100,
          lastClaimDate: new Date().toISOString().slice(0, 10),
          isAdmin: isAdmin
        });
        onLogin({ username: cleanUsername, isAdmin });
      }
    } catch (err) {
      setError("An error occurred while logging in");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
      <h2>Login to UJEMU DAO</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: '10px', margin: '10px', width: '200px' }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px', margin: '10px', width: '200px' }}
      />
      <br />
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          border: 'none',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Login / Register
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;