import { motion } from 'framer-motion';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import Leaderboard from './Leaderboard';

function Game({ user, onLogout }) {
  console.log("Game.jsx received user:", user); // DEBUG

  if (!user || !user.uid || !user.username) {
    return <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading user...</p>;
  }

  const [username, setUsername] = useState(user.username || 'anonymous');
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [level, setLevel] = useState(0);
  const [multiplierCost, setMultiplierCost] = useState(50);
  const [autoClickerCost, setAutoClickerCost] = useState(100);
  const [lastClaimDate, setLastClaimDate] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAdmin = user?.isAdmin === true;
  const uid = user.uid;
  const todayDate = new Date().toISOString().slice(0, 10);

  const savePlayerData = async () => {
    await setDoc(doc(db, "players", uid), {
      username,
      coins: clicks,
      level,
      multiplier,
      autoClickers,
      multiplierCost,
      autoClickerCost,
      lastClaimDate,
      isAdmin
    });
  };

  const loadPlayerData = async () => {
    try {
      const docSnap = await getDoc(doc(db, "players", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || 'anonymous');
        setClicks(data.coins || 0);
        setLevel(data.level || 0);
        setMultiplier(data.multiplier || 1);
        setAutoClickers(data.autoClickers || 0);
        setMultiplierCost(data.multiplierCost || 50);
        setAutoClickerCost(data.autoClickerCost || 100);
        setLastClaimDate(data.lastClaimDate || '');
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading player data:", err);
    }
  };

  useEffect(() => {
    loadPlayerData();
  }, [uid]);

  useEffect(() => {
    if (!loading) setInitialLoadDone(true);
  }, [loading]);

  useEffect(() => {
    if (initialLoadDone) savePlayerData();
  }, [clicks, multiplier, autoClickers, level, lastClaimDate]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "leaderboard", "global"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const playersArray = Object.values(data);
        playersArray.sort((a, b) => b.coins - a.coins);
        setPlayers(playersArray);
      }
    }, (err) => console.error("Error loading leaderboard:", err));
    return () => unsub();
  }, []);

  useEffect(() => {
    let currentLevel = 0;
    let totalCoinsRequired = getCoinsNeededForLevel(0);
    while (clicks >= totalCoinsRequired) {
      currentLevel++;
      totalCoinsRequired += getCoinsNeededForLevel(currentLevel);
    }
    setLevel(currentLevel);
  }, [clicks]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        setClicks(prev => prev + autoClickers);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoClickers, loading]);

  const handleClick = () => setClicks(prev => prev + multiplier);

  const handleUpgradeMultiplier = () => {
    if (clicks >= multiplierCost) {
      setMultiplier(prev => prev + 1);
      setClicks(prev => prev - multiplierCost);
      setMultiplierCost(prev => prev + multiplierCost * 0.2);
      showPopup('Multiplier Upgraded!');
    } else {
      alert(`You need at least ${Math.ceil(multiplierCost)} coins to upgrade!`);
    }
  };

  const handleAddAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setAutoClickers(prev => prev + 1);
      setClicks(prev => prev - autoClickerCost);
      setAutoClickerCost(prev => prev + autoClickerCost * 0.2);
      showPopup('Auto-Clicker Purchased!');
    } else {
      alert(`You need at least ${Math.ceil(autoClickerCost)} coins to buy an Auto-Clicker!`);
    }
  };

  const handleDailyReward = () => {
    if (lastClaimDate !== todayDate) {
      setClicks(prev => prev + 10000);
      setLastClaimDate(todayDate);
      showPopup('Daily Reward Claimed! +10,000 Coins');
    } else {
      alert("You have already claimed today's reward!");
    }
  };

  const getCoinsNeededForLevel = (lvl) => 10000 + (lvl * 15000);

  const coinsForNextLevel = (() => {
    let requiredCoins = 0;
    for (let i = 0; i <= level; i++) {
      requiredCoins += getCoinsNeededForLevel(i);
    }
    return requiredCoins;
  })();

  const progressWidth = Math.min((clicks / coinsForNextLevel) * 100, 100);

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(''), 2000);
  };

  const handleDeletePlayer = async (targetUid) => {
    if (window.confirm(`Delete this player permanently?`)) {
      try {
        await deleteDoc(doc(db, "players", targetUid));
        alert('Deleted!');
      } catch (err) {
        alert('Error deleting.');
      }
    }
  };

  const handleResetPlayer = async (targetUid) => {
    if (window.confirm(`Reset coins and level for this player?`)) {
      try {
        await updateDoc(doc(db, "players", targetUid), {
          coins: 0,
          level: 0
        });
        alert('Reset done.');
      } catch (err) {
        alert('Error resetting.');
      }
    }
  };

  if (showLeaderboard) {
    return <Leaderboard players={players} onBack={() => setShowLeaderboard(false)} />;
  }

  if (showAdminPanel) {
    return (
      <div style={{ padding: 20, color: 'white', backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
        <h2>Admin Panel</h2>
        <button onClick={() => setShowAdminPanel(false)}>Back to Game</button>
        <table style={{ width: '100%', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Username</th><th>Coins</th><th>Level</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={i}>
                <td>{p.username}</td>
                <td>{p.coins}</td>
                <td>{p.level}</td>
                <td>
                  <button onClick={() => handleResetPlayer(p.uid)} style={{ marginRight: 10 }}>Reset</button>
                  <button onClick={() => handleDeletePlayer(p.uid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#121212",
      minHeight: "100vh",
      color: "white"
    }}>
      <h1 style={{
        fontSize: "28px",
        fontWeight: "bold",
        color: "#ffffff",
        textShadow: "0 0 10px #00f7ff",
      }}>
        WELCOME TO UJEMU'S DAO ✨
      </h1>

      <h2>Player: {username}</h2>
      <h2>Coins: {Math.floor(clicks)}</h2>
      <h3>Level: {level}</h3>
      <p>Next level at: {coinsForNextLevel} coins</p>

      <div style={{
        width: "80%",
        height: "20px",
        backgroundColor: "#333",
        margin: "10px auto",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${progressWidth}%`,
          height: "100%",
          backgroundColor: "#4CAF50"
        }}></div>
      </div>

      {popupMessage && (
        <div style={{
          margin: "10px auto",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          borderRadius: "8px",
        }}>
          {popupMessage}
        </div>
      )}

      <motion.button
        whileTap={{ scale: 1.2 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={handleClick}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          margin: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Click Me!
      </motion.button>

      <div>
        <button onClick={handleUpgradeMultiplier}>Upgrade Multiplier (x{multiplier})</button>
        <button onClick={handleAddAutoClicker}>Add AutoClicker ({autoClickers})</button>
      </div>

      <div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDailyReward}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#ff9800',
            color: 'white',
            borderRadius: '8px'
          }}
        >
          Claim Daily Reward
        </motion.button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <motion.button
          onClick={() => setShowLeaderboard(true)}
          style={{ marginRight: 10 }}
        >
          View Full Leaderboard
        </motion.button>

        {isAdmin && (
          <motion.button
            onClick={() => setShowAdminPanel(true)}
            style={{ backgroundColor: '#ff5722', color: 'white' }}
          >
            Open Admin Panel
          </motion.button>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '8px'
        }}
      >
        Logout
      </motion.button>
    </div>
  );
}

export default Game;