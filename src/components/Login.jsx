import { useState } from 'react';
import { ref, get, child } from 'firebase/database';
import { database } from '../firebase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const cleanUsername = username.trim().toLowerCase();
    const userRef = ref(database);

    try {
      const usernameSnap = await get(child(userRef, `usernames/${cleanUsername}`));
      if (!usernameSnap.exists() || usernameSnap.val() !== email) {
        setError("Invalid email or username");
        return;
      }

      const userSnap = await get(child(userRef, `users/${email}`));
      if (!userSnap.exists()) {
        setError("User data not found");
        return;
      }

      onLogin({ email, username: cleanUsername });
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={handleLogin}>Log In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;