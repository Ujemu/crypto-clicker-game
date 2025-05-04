import { useState } from 'react';
import { ref, get, set, child } from 'firebase/database';
import { database } from '../firebase';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !username) {
      setError("Please fill both fields");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const userRef = ref(database);

    try {
      const usernameSnap = await get(child(userRef, `usernames/${cleanUsername}`));
      if (usernameSnap.exists()) {
        setError("Username already taken");
        return;
      }

      await set(child(userRef, `users/${email}`), {
        email,
        username: cleanUsername,
        coins: 0,
        multiplier: 1,
        autoClickers: 0,
        level: 1,
      });

      await set(child(userRef, `usernames/${cleanUsername}`), email);
      onSignup({ email, username: cleanUsername });
    } catch (err) {
      console.error(err);
      setError("Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Signup;