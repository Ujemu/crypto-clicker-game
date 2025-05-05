import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';

function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username) {
      setError('Please enter your username.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const userRef = ref(database, `players/${cleanUsername}`);

    try {
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        setError('User not found. Please sign up first.');
        return;
      }

      const userData = snapshot.val();
      onLogin({ username: cleanUsername, displayName: userData.displayName });
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Login failed. Try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
    }}>
      <h2 style={{ color: 'white' }}>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          margin: '10px',
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '200px'
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontWeight: 'bold',
          marginTop: '10px',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#00ff99',
          color: '#000',
          cursor: 'pointer'
        }}
      >
        Login
      </motion.button>
      <button
        onClick={onSwitch}
        style={{
          marginTop: '15px',
          background: 'none',
          border: 'none',
          color: '#00ff99',
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        Don't have an account? Sign up
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;