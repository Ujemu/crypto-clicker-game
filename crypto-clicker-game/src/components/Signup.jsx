import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth, database } from '../firebase';
import { motion } from 'framer-motion';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !username) {
      setError('Please enter both email and username.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const randomPassword = Math.random().toString(36).slice(-10) + 'A!';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, randomPassword);
      const user = userCredential.user;

      // Save user data in Realtime Database under players/{uid}
      await set(ref(database, `players/${user.uid}`), {
        email,
        username: cleanUsername
      });

      onSignup({ uid: user.uid, username: cleanUsername });
    } catch (err) {
      console.error('Signup error:', err.code, err.message);
      setError('Signup failed. Try again.');
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
      <h2 style={{ color: 'white' }}>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          margin: '10px',
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '200px'
        }}
      />
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
        onClick={handleSignup}
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
        Register
      </motion.button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Signup;