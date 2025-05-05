import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';
import Leaderboard from './Leaderboard';

function Game({ user, onLogout }) {
  const [coins, setCoins] = useState(0);
  const [lastClaim, setLastClaim] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const userRef = ref(database, `players/${user.username}`);
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCoins(data.coins || 0);
        setLastClaim(data.lastClaim || null);
      }
    });
  }, [user.username]);

  const handleDailyClaim = async () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastClaim && now - lastClaim < oneDay) {
      alert('You’ve already claimed your daily reward. Come back later!');
      return;
    }

    const newCoins = coins + 50;
    setCoins(newCoins);
    setLastClaim(now);

    await update(ref(database, `players/${user.username}`), {
      coins: newCoins,
      lastClaim: now
    });
  };

  if (showLeaderboard) {
    return <Leaderboard onBack={() => setShowLeaderboard(false)} />;
  }

  return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ marginBottom: '10px' }}
      >
        Welcome To Ujemu's Dao ✨
      </motion.h2>
      <h3 style={{ color: '#00ff99' }}>{user.displayName}</h3>

      <p style={{ fontSize: '18px', marginTop: '10px' }}>Coins: {coins}</p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDailyClaim}
        style={buttonStyle}
      >
        Claim Daily Points
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowLeaderboard(true)}
        style={buttonStyle}
      >
        View Leaderboard
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        style={{ ...buttonStyle, backgroundColor: '#ff5555' }}
      >
        Logout
      </motion.button>
    </div>
  );
}

const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#00ff99',
  color: '#000',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Game;