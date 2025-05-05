import { useEffect, useState } from 'react';
import { ref, get, set, update } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Leaderboard from './Leaderboard';

function Game({ user, onLogout }) {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [level, setLevel] = useState(0);
  const [multiplierCost, setMultiplierCost] = useState(20000);
  const [autoClickerCost, setAutoClickerCost] = useState(50000);
  const [lastClaim, setLastClaim] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const username = user.username;
  const displayName = user.displayName;

  const getCoinsNeededForLevel = (lvl) => 10000 + (lvl * 15000);

  useEffect(() => {
    const userRef = ref(database, `players/${username}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setClicks(data.coins || 0);
        setLevel(data.level || 0);
        setMultiplier(data.multiplier || 1);
        setAutoClickers(data.autoClickers || 0);
        setMultiplierCost(data.multiplierCost || 20000);
        setAutoClickerCost(data.autoClickerCost || 50000);
        setLastClaim(data.lastClaim || null);
      }
    });
  }, [username]);

  useEffect(() => {
    const userRef = ref(database, `players/${username}`);
    set(userRef, {
      username,
      displayName,
      coins: clicks,
      level,
      multiplier,
      autoClickers,
      multiplierCost,
      autoClickerCost,
      lastClaim,
    });
  }, [clicks, multiplier, autoClickers, level, multiplierCost, autoClickerCost, lastClaim, username, displayName]);

  useEffect(() => {
    let currentLevel = 0;
    let total = getCoinsNeededForLevel(0);
    while (clicks >= total) {
      currentLevel++;
      total += getCoinsNeededForLevel(currentLevel);
    }

    if (currentLevel > level) {
      toast.success(`🎉 Congrats! You reached Level ${currentLevel}`);
    }

    setLevel(currentLevel);
  }, [clicks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks((prev) => prev + autoClickers);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  const handleClick = () => {
    setClicks((prev) => prev + multiplier);
  };

  const handleUpgradeMultiplier = () => {
    if (clicks >= multiplierCost) {
      setMultiplier((prev) => prev + 1);
      setClicks((prev) => prev - multiplierCost);
      setMultiplierCost((prev) => Math.ceil(prev + prev * 0.5));
      toast.info(`⚡ Multiplier upgraded to x${multiplier + 1}`);
    } else {
      alert(`You need at least ${multiplierCost} coins to upgrade multiplier.`);
    }
  };

  const handleAddAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setAutoClickers((prev) => prev + 1);
      setClicks((prev) => prev - autoClickerCost);
      setAutoClickerCost((prev) => Math.ceil(prev + prev * 0.005));
    } else {
      alert(`You need at least ${autoClickerCost} coins to add an auto-clicker.`);
    }
  };

  const handleDailyClaim = () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastClaim && now - lastClaim < oneDay) {
      alert('You’ve already claimed your daily reward. Come back later!');
      return;
    }

    const newCoins = clicks + 50;
    setClicks(newCoins);
    setLastClaim(now);

    update(ref(database, `players/${username}`), {
      coins: newCoins,
      lastClaim: now,
    });
  };

  const coinsForNextLevel = (() => {
    let total = 0;
    for (let i = 0; i <= level; i++) {
      total += getCoinsNeededForLevel(i);
    }
    return total;
  })();

  const progressWidth = Math.min((clicks / coinsForNextLevel) * 100, 100);

  if (showLeaderboard) return <Leaderboard onBack={() => setShowLeaderboard(false)} />;

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <ToastContainer position="top-center" autoClose={3000} />

      <motion.h1
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#ffffff",
          textShadow: "0 0 10px #00f7ff, 0 0 20px #00f7ff, 0 0 30px #00f7ff",
          marginBottom: "10px",
        }}
      >
        Welcome To Ujemu's Dao ✨
      </motion.h1>

      <h3 style={{ color: '#00ff99' }}>{displayName}</h3>
      <p style={{ fontSize: '18px', marginTop: '10px' }}>Coins: {clicks}</p>
      <h4>Level: {level}</h4>
      <p>Next Level at: {coinsForNextLevel} coins</p>

      {/* Progress Bar */}
      <div style={{ width: "80%", height: "20px", backgroundColor: "#333", margin: "10px auto", borderRadius: "10px" }}>
        <div
          style={{
            width: progressWidth + '%',
            height: "100%",
            backgroundColor: "#4CAF50"
          }}
        ></div>
      </div>

      {/* Buttons */}
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClick} style={btnStyle}>
        Click Me!
      </motion.button>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleUpgradeMultiplier} style={{ ...btnStyle, backgroundColor: '#2196F3' }}>
        Upgrade Multiplier (x{multiplier})<br />
        Cost: {multiplierCost} coins
      </motion.button>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddAutoClicker} style={{ ...btnStyle, backgroundColor: '#FF5722' }}>
        Add Auto-Clicker ({autoClickers})<br />
        Cost: {autoClickerCost} coins
      </motion.button>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDailyClaim} style={{ ...btnStyle, backgroundColor: '#00bfa5' }}>
        Claim Daily Coins (+50)
      </motion.button>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowLeaderboard(true)} style={{ ...btnStyle, backgroundColor: '#9c27b0' }}>
        View Leaderboard
      </motion.button>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLogout} style={{ ...btnStyle, backgroundColor: '#ff5555' }}>
        Logout
      </motion.button>
    </div>
  );
}

const btnStyle = {
  margin: '10px',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  backgroundColor: '#00ff99',
  color: '#000',
  cursor: 'pointer'
};

export default Game;