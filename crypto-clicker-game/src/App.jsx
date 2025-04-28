import { useState } from 'react';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Game from './components/Game';

function App() {
  const [step, setStep] = useState('welcome'); // welcome -> login -> game
  const [user, setUser] = useState(null);

  const handleWelcomeFinish = () => {
    setStep('login');
  };

  const handleLogin = (username) => {
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