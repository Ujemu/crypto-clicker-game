import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username) {
      setError('Please enter your username.');
      return;
    }

    const usernameRef = doc(db, 'usernames', username.toLowerCase());
    const docSnap = await getDoc(usernameRef);

    if (!docSnap.exists()) {
      setError('No account found for that username.');
      return;
    }

    const { email } = docSnap.data();
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, 'dummy-password');
      const user = userCredential.user;
      onLogin({ uid: user.uid, username });
    } catch (err) {
      console.error(err.message);
      setError('Login failed.');
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
        Log In
      </motion.button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Login;