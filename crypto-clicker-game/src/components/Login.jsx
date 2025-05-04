import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      setError('Please enter your username.');
      return;
    }

    try {
      const usernameRef = doc(db, 'usernames', cleanUsername);
      const docSnap = await getDoc(usernameRef);

      if (!docSnap.exists()) {
        setError('No account found for that username.');
        return;
      }

      const { email } = docSnap.data();
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, 'dummy-password');
      const user = userCredential.user;

      onLogin({ uid: user.uid, username: cleanUsername });
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: 'white' }}>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: '10px',
          margin: '10px 0',
          width: '250px',
          fontSize: '16px',
          borderRadius: '5px',
        }}
      />
      <br />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontWeight: 'bold',
          fontSize: '16px',
          borderRadius: '5px',
          backgroundColor: '#00f',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Log In
      </motion.button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;