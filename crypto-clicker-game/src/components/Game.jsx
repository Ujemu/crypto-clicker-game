import { motion } from "framer-motion";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

function Game({ user }) {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [players, setPlayers] = useState([]);
  const [level, setLevel] = useState(1);
  const username = user || "Anonymous";

  // Save player when clicks or level change
  useEffect(() => {
    if (username) {
      const userRef = ref(database, `players/${username}`);
      set(userRef, {
        username: username,
        coins: clicks,
        level: level,
      });
    }
  }, [clicks, username, level]);

  // Calculate Level based on coins
  useEffect(() => {
    const newLevel = Math.floor(clicks / 100) + 1;
    setLevel(newLevel);
  }, [clicks]);

  // Auto-clickers
  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prev => prev + autoClickers);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  // Fetch all players
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

  const handleClick = () => {
    setClicks(prev => prev + multiplier);
  };

  const handleUpgradeMultiplier = () => {
    if (clicks >= 50) {
      setMultiplier(prev => prev + 1);
      setClicks(prev => prev - 50);
    } else {
      alert("You need at least 50 coins to upgrade your multiplier!");
    }
  };

  const handleAddAutoClicker = () => {
    if (clicks >= 100) {
      setAutoClickers(prev => prev + 1);
      setClicks(prev => prev - 100);
    } else {
      alert("You need at least 100 coins to unlock an Auto-Clicker!");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <h1>Welcome, {username}</h1>
      <h2>Coins: {clicks}</h2>
      <h3>Level: {level}</h3>

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
            cursor: clicks >= 50 ? "pointer" : "not-allowed",
            opacity: clicks >= 50 ? 1 : 0.6
          }}
        >
          Upgrade Multiplier (x{multiplier})
          <br />
          <small>Need 50 Coins</small>
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
            cursor: clicks >= 100 ? "pointer" : "not-allowed",
            opacity: clicks >= 100 ? 1 : 0.6
          }}
        >
          Add Auto-Clicker ({autoClickers})
          <br />
          <small>Need 100 Coins</small>
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
                  <td>{player.coins}</td>
                  <td>{player.level || 1}</td> {/* fallback to level 1 if missing */}
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