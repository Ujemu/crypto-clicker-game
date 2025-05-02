import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Login({ onLogin }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      setError("Please enter both username/email and password");
      return;
    }

    const cleanInput = emailOrUsername.trim().toLowerCase();
    const email = cleanInput.includes("@") ? cleanInput : `${cleanInput}@ujemu.com; // use email format for Firebase Auth`

    try {
      // Try to log in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user data
      const userDoc = await getDoc(doc(db, "players", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      onLogin({
        uid: user.uid,
        username: userData.username || cleanInput,
        isAdmin: userData.isAdmin || false,
        ...userData
      });

    } catch (loginError) {
      // If user not found, register them
      if (loginError.code === "auth/user-not-found") {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          const isAdmin = cleanInput === "web3degen";

          const newUserData = {
            username: cleanInput,
            coins: 0,
            level: 0,
            multiplier: 1,
            autoClickers: 0,
            multiplierCost: 50,
            autoClickerCost: 100,
            lastClaimDate: new Date().toISOString().slice(0, 10),
            isAdmin
          };

          await setDoc(doc(db, "players", user.uid), newUserData);

          onLogin({
            uid: user.uid,
            username: cleanInput,
            isAdmin,
            ...newUserData
          });
        } catch (registerError) {
          setError("Registration failed: " + registerError.message);
        }
      } else {
        setError("Login failed: " + loginError.message);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
      <h2>Login to UJEMU DAO</h2>
      <input
        type="text"
        placeholder="Username or Email"
        value={emailOrUsername}
        onChange={(e) => setEmailOrUsername(e.target.value)}
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