import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ref, get, set, onValue } from 'firebase/database';
import { database } from '../firebase';
import Leaderboard from './Leaderboard';

function Game({ user, onLogout }) {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [level, setLevel] = useState(1);
  const [multiplierCost, setMultiplierCost] = useState(50);
  const [autoClickerCost, setAutoClickerCost] = useState(100);
  const [popupMessage, setPopupMessage] = useState('');

  const { email, username } = user || {};

  useEffect(() => {
    if (!email) return;

    const userRef = ref(database, `users/${email}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setClicks(data.coins || 0);
        setMultiplier(data.multiplier || 1);
        setAutoClickers(data.autoClickers || 0);
        setLevel(data.level || 1);
      }
    });

    return () => unsubscribe();
  }, [email]);

  useEffect(() => {
    if (!email) return;

    const userRef = ref(database, `users/${email}`);
    set(userRef, {
      email,
      username,
      coins: clicks,
      multiplier,
      autoClickers,
      level,
    });
  }, [clicks, multiplier, autoClickers, level, email, username]);

  const handleClick = () => {
    const newClicks = clicks + multiplier;
    setClicks(newClicks);

    const levelUp = Math.floor(newClicks / 100);
    setLevel(levelUp + 1);
  };

  const handleUpgradeMultiplier = () => {
    if (clicks >= multiplierCost) {
      setClicks(prev => prev - multiplierCost);
      setMultiplier(prev => prev + 1);
      setMultiplierCost(prev => Math.floor(prev * 1.5));
      showPopup("Multiplier upgraded!");
    }
  };

  const handleBuyAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setClicks(prev => prev - autoClickerCost);
      setAutoClickers(prev => prev + 1);
      setAutoClickerCost(prev => Math.floor(prev * 1.8));
      showPopup("Auto-clicker purchased!");
    }
  };

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(''), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prev => prev + autoClickers);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickers]);

  if (!email || !username) {
    return <p style={{ color: 'white', textAlign: 'center' }}>Loading user...</p>;
  }

  return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <h2>Welcome, {username}</h2>
      <motion.h1 animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
        Coins: {clicks}
      </motion.h1>

      <motion.button whileTap={{ scale: 0.9 }} onClick={handleClick}>
        Click Coin
      </motion.button>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleUpgradeMultiplier}>Upgrade Multiplier ({multiplierCost})</button>
        <button onClick={handleBuyAutoClicker}>Buy AutoClicker ({autoClickerCost})</button>
      </div>

      <p>Multiplier: {multiplier}</p>
      <p>AutoClickers: {autoClickers}</p>
      <p>Level: {level}</p>

      {popupMessage && (
        <motion.div
          style={{ marginTop: '10px', background: '#333', padding: '10px', borderRadius: '8px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {popupMessage}
        </motion.div>
      )}

      <button style={{ marginTop: '30px' }} onClick={onLogout}>
        Logout
      </button>

      <Leaderboard />
    </div>
  );
}

export default Game;