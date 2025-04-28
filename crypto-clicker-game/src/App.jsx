import { useState } from 'react';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Game from './components/Game';
import { ref, set } from 'firebase/database';
import { database } from './firebase';  // adjust path if your firebase.js is elsewhere

function App() {
  const [step, setStep] = useState('welcome'); // 'welcome' -> 'login' -> 'game'
  const [user, setUser] = useState(null);

  const handleWelcomeFinish = () => {
    setStep('login');
  };

  const handleLogin = (username) => {
    // Immediately save user to Firebase when login
    if (username) {
      const userRef = ref(database, `players/${username}`);
      set(userRef, {
        username: username,
        coins: 0,
        level: 1
      });
    }

    setUser(username);
    setStep('game');
  };

  return (
    <>
      {step === 'welcome' && <Welcome onFinish={handleWelcomeFinish} />}
      {step === 'login' && <Login onLogin={handleLogin} />}
      {step === 'game' && <Game user={user} />}
    </>
  );
}

export default App;