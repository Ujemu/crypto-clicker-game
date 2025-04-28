import { useState } from 'react';
import { motion } from 'framer-motion';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    const cleanUsername = username.trim().toLowerCase(); // Always lowercase and no spaces

    if (cleanUsername.length >= 3) { // Minimum username length check
      onLogin(cleanUsername);
    } else {
      alert("Username must be at least 3 characters long!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin(); // Allow pressing "Enter" to login
    }
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '20px'
    }}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Enter your username
      </motion.h2>

      <motion.input
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown} // Added to allow Enter key
        placeholder="Enter your username"
        style={{
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: 'none',
          marginTop: '20px',
          textAlign: 'center',
        }}
      />

      <motion.button
        onClick={handleLogin}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Start Playing
      </motion.button>
    </div>
  );
}

export default Login;