import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Login({ onLogin }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!usernameInput || !password) {
      setError("Please enter both username and password");
      return;
    }

    const cleanUsername = usernameInput.trim().toLowerCase();
    const email = `${cleanUsername}@ujemu.com`; // Always generate in same format

    try {
      // Try to log the user in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "players", user.uid);
      const docSnap = await getDoc(userDocRef);

      let userData = {};
      if (docSnap.exists()) {
        userData = docSnap.data();
      } else {
        // If user exists in Auth but not Firestore
        userData = {
          username: cleanUsername,
          coins: 0,
          level: 0,
          multiplier: 1,
          autoClickers: 0,
          multiplierCost: 50,
          autoClickerCost: 100,
          lastClaimDate: new Date().toISOString().slice(0, 10),
          isAdmin: cleanUsername === "web3degen"
        };
        await setDoc(userDocRef, userData);
      }

      onLogin({
        uid: user.uid,
        username: userData.username || cleanUsername,
        isAdmin: userData.isAdmin || false,
        ...userData
      });

    } catch (loginError) {
      console.log("Login error:", loginError.code, loginError.message);

      if (loginError.code === "auth/user-not-found") {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          const isAdmin = cleanUsername === "web3degen";
          const newUserData = {
            username: cleanUsername,
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
            username: cleanUsername,
            isAdmin,
            ...newUserData
          });
        } catch (registerError) {
          console.log("Registration failed:", registerError.message);
          setError("Registration failed: " + registerError.message);
        }
      } else if (loginError.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
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
        placeholder="Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
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