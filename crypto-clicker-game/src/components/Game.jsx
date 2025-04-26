import { motion } from "framer-motion";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

function Game({ user }) {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [players, setPlayers] = useState([]);
  const [level, setLevel] = useState(1); // New: Level

  const username = user || "Anonymous";

  const handleClick = () => {
    setClicks(prev => prev + multiplier);
  };

  const handleUpgradeMultiplier = () => {
    if (clicks >= 20) {
      setMultiplier(prev => prev + 1);
      setClicks(prev => prev - 20); // Deduct 20 coins
    } else {
      alert("You need at least 20 coins to upgrade your multiplier!");
    }
  };

  const handleAddAutoClicker = () => {
    if (clicks >= 100) {
      setAutoClickers(prev => prev + 1);
      setClicks(prev => prev - 100); // Deduct 100 coins
    } else {
      alert("You need at least 100 coins to unlock an Auto-Clicker!");
    }
  };

  // Auto-clickers work automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prev => prev + autoClickers);
    }, 3000); // Every 3 seconds
    return () => clearInterval(interval);
  }, [autoClickers]);

  // Update Level based on coins
  useEffect(() => {
    const newLevel = Math.floor(clicks / 50) + 1;
    setLevel(newLevel);
  }, [clicks]);

  // Save to Firebase
  useEffect(() => {
    if (username) {
      set(ref(database, 'players/' + username), {
        username: username,
        coins: clicks,
      });
    }
  }, [clicks, username]);

  // Fetch leaderboard players
  useEffect(() => {
    const playersRef = ref(database, "players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.values(data);
        playersArray.sort((a, b) => b.coins - a.coins);
        setPlayers(playersArray);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome, {username}</h1>
      <h2>Coins: {clicks}</h2>
      <h3>Level: {level}</h3>

      {/* Animated Click Button */}
      <motion.button
        whileTap={{ scale: 1.2 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={handleClick}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          margin: "20px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.2)"
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
            color: "white",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            cursor: clicks >= 20 ? "pointer" : "not-allowed",
            opacity: clicks >= 20 ? 1 : 0.6
          }}
        >
          Upgrade Multiplier (x{multiplier})
          <br />
          <small>Need 20 Coins</small>
        </button>

        <button 
          onClick={handleAddAutoClicker}
          style={{
            margin: "10px",
            padding: "15px 25px",
            fontSize: "16px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            cursor: clicks >= 100 ? "pointer" : "not-allowed",
            opacity: clicks >= 100 ? 1 : 0.6
          }}
        >
          Add Auto-Clicker ({autoClickers})
          <br />
          <small>Need 100 Coins</small>
        </button>
      </div>

      {/* Leaderboard Section */}
      <div style={{ marginTop: "50px" }}>
        <h2>Leaderboard</h2>
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid black", padding: "10px" }}>Rank</th>
              <th style={{ borderBottom: "2px solid black", padding: "10px" }}>Username</th>
              <th style={{ borderBottom: "2px solid black", padding: "10px" }}>Coins</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.username}>
                <td style={{ padding: "10px" }}>{index + 1}</td>
                <td style={{ padding: "10px" }}>{player.username}</td>
                <td style={{ padding: "10px" }}>{player.coins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Game;