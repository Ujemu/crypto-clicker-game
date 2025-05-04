import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
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

    const usernameRef = doc(db, 'usernames', username.toLowerCase());

    const docSnap = await getDoc(usernameRef);
    if (docSnap.exists()) {
      setError('That username is already registered. Please choose another.');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'dummy-password');
      const user = userCredential.user;

      await setDoc(usernameRef, { email });

      onSignup({ uid: user.uid, username });
    } catch (err) {
      console.error(err.message);
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