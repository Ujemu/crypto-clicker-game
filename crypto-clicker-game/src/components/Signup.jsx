import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: 'white' }}>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: '5px' }}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: '5px' }}
      />
      <br />
      <button onClick={handleSignup}>Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Signup;