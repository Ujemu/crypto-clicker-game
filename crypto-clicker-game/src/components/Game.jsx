import { motion } from "framer-motion";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

function Game({ user }) {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [players, setPlayers] = useState([]);
  const [level, setLevel] = useState(0);
  const [multiplierCost, setMultiplierCost] = useState(50);
  const [autoClickerCost, setAutoClickerCost] = useState(100);
  const [popupMessage, setPopupMessage] = useState('');

  const username = (user || "Anonymous").toLowerCase(); // Always lowercase username

  // Function to calculate coins needed per level
  const getCoinsNeededForLevel = (lvl) => {
    return 10000 + (lvl * 15000);
  };

  // Load player data from Firebase
  useEffect(() => {
    if (username) {
      const userRef = ref(database, `players/${username}`);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setClicks(data.coins || 0);
          setLevel(data.level || 0);
          setMultiplier(data.multiplier || 1);
          setAutoClickers(data.autoClickers || 0);
          setMultiplierCost(data.multiplierCost || 50);
          setAutoClickerCost(data.autoClickerCost || 100);
        } else {
          set(userRef, {
            username: username,
            coins: 0,
            level: 0,
            multiplier: 1,
            autoClickers: 0,
            multiplierCost: 50,
            autoClickerCost: 100,
          });
        }
      });
    }
  }, [username]);

  // Save player progress
  useEffect(() => {
    if (username) {
      const userRef = ref(database, `players/${username}`);
      set(userRef, {
        username: username,
        coins: clicks,
        level: level,
        multiplier: multiplier,
        autoClickers: autoClickers,
        multiplierCost: multiplierCost,
        autoClickerCost: autoClickerCost,
      });
    }
  }, [clicks, level, multiplier, autoClickers, multiplierCost, autoClickerCost, username]);

  // Calculate Level based on coins
  useEffect(() => {
    let currentLevel = 0;
    let totalCoinsRequired = getCoinsNeededForLevel(0);
    while (clicks >= totalCoinsRequired) {
      currentLevel++;
      totalCoinsRequired += getCoinsNeededForLevel(currentLevel);
    }
    setLevel(currentLevel);
  }, [clicks]);

  // Auto-clickers earning coins every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prev => prev + autoClickers);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  // Fetch leaderboard
  useEffect(() => {
    const playersRef = ref(database, "players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.values(data);
        playersArray.sort((a, b) => b.coins - a.coins);
        setPlayers(playersArray);
      } else {
        setPlayers([]);
      }
    });
  }, []);

  // Button handlers
  const handleClick = () => {
    setClicks(prev => prev + multiplier);
  };

  const handleUpgradeMultiplier = () => {
    if (clicks >= multiplierCost) {
      setMultiplier(prev => prev + 1);
      setClicks(prev => prev - multiplierCost);
      setMultiplierCost(prev => prev + prev * 0.2); // 20% price increase
      setPopupMessage('Multiplier Upgraded!');
      setTimeout(() => setPopupMessage(''), 2000);
    } else {
      alert(`You need at least ${Math.ceil(multiplierCost)} coins to upgrade your multiplier!`);
    }
  };

  const handleAddAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      setAutoClickers(prev => prev + 1);
      setClicks(prev => prev - autoClickerCost);
      setAutoClickerCost(prev => prev + prev * 0.2); // 20% price increase
      setPopupMessage('Auto-Clicker Purchased!');
      setTimeout(() => setPopupMessage(''), 2000);
    } else {
      alert(`You need at least ${Math.ceil(autoClickerCost)} coins to buy an Auto-Clicker!`);
    }
  };

  // Progress Bar
  const coinsForNextLevel = (() => {
    let requiredCoins = 0;
    for (let i = 0; i <= level; i++) {
      requiredCoins += getCoinsNeededForLevel(i);
    }
    return requiredCoins;
  })();

  const progressWidth = Math.min((clicks / coinsForNextLevel) * 100, 100);

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      
      {/* Glowing Welcome Banner */}
      <h1 style={{
        fontSize: "28px",
        fontWeight: "bold",
        color: "#ffffff",
        textShadow: "0 0 10px #00f7ff, 0 0 20px #00f7ff, 0 0 30px #00f7ff",
        animation: "glow 2s infinite alternate"
      }}>
        WELCOME TO UJEMU'S DAO ✨
      </h1>

      {/* Popup Message */}
      {popupMessage && (
        <div style={{
          margin: "10px auto",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "8px",
          width: "fit-content",
          fontSize: "16px",
          animation: "fade 2s"
        }}>
          {popupMessage}
        </div>
      )}

      <h2>Coins: {Math.floor(clicks)}</h2>
      <h3>Level: {level}</h3>
      <p>Next level at: {coinsForNextLevel} coins</p>

      {/* Progress Bar */}
      <div style={{ width: "80%", height: "20px", backgroundColor: "#333", margin: "10px auto", borderRadius: "10px", overflow: "hidden" }}>
        <div 
          style={{ 
            width: progressWidth + '%',
            height: "100%",
            backgroundColor: "#4CAF50"
          }}
        ></div>
      </div>

      {/* Click Button */}
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

      {/* Upgrade Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={handleUpgradeMultiplier}
          style={{
            margin: "10px",
            padding: "15px 25px",
            fontSize: "16px",
            backgroundColor: "#2196F3",
            border: "none",
            borderRadius: "8px",
            cursor: clicks >= multiplierCost ? "pointer" : "not-allowed",
            opacity: clicks >= multiplierCost ? 1 : 0.6
          }}
        >
          Upgrade Multiplier (x{multiplier})
          <br />
          <small>Cost: {Math.ceil(multiplierCost)} Coins</small>
        </button>

        <button 
          onClick={handleAddAutoClicker}
          style={{
            margin: "10px",
            padding: "15px 25px",
            fontSize: "16px",
            backgroundColor: "#FF5722",
            border: "none",
            borderRadius: "8px",
            cursor: clicks >= autoClickerCost ? "pointer" : "not-allowed",
            opacity: clicks >= autoClickerCost ? 1 : 0.6
          }}
        >
          Add Auto-Clicker ({autoClickers})
          <br />
          <small>Cost: {Math.ceil(autoClickerCost)} Coins</small>
        </button>
      </div>

      {/* Leaderboard */}
      <div style={{ marginTop: "50px", backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "12px" }}>
        <h2>Leaderboard</h2>
        {players.length > 0 ? (
          <table style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Coins</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player.username}</td>
                  <td>{Math.floor(player.coins)}</td>
                  <td>{player.level || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading leaderboard...</p>
        )}
      </div>
    </div>
  );
}

export default Game;