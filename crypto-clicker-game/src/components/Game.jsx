import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase"; // adjust path if needed
import { useEffect, useState } from "react";

function Game({ user }) {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [players, setPlayers] = useState([]);

  const username = user || "Anonymous"; // Default name if none

  const handleClick = () => {
    setClicks(prev => prev + multiplier);
  };

  // Save to Firebase whenever clicks change
  useEffect(() => {
    if (username) {
      set(ref(database, 'players/' + username), {
        username: username,
        coins: clicks,
      });
    }
  }, [clicks, username]);

  // Fetch all players from Firebase for leaderboard
  useEffect(() => {
    const playersRef = ref(database, "players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.values(data);
        playersArray.sort((a, b) => b.coins - a.coins); // Sort by coins descending
        setPlayers(playersArray);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome, {username}</h1>
      <h2>Coins: {clicks}</h2>
      <button 
        onClick={handleClick} 
        style={{ padding: "10px 20px", fontSize: "16px", margin: "10px", cursor: "pointer" }}
      >
        Click Me!
      </button>

      {/* Upgrade Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button style={{ margin: "10px", padding: "10px" }}>
          Upgrade Multiplier (x{multiplier})
        </button>
        <button style={{ margin: "10px", padding: "10px" }}>
          Add Auto-Clicker ({autoClickers})
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