// src/components/Leaderboard.jsx
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const playersRef = ref(database, "players/");
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.values(data);
        // Sort players by coins (highest first)
        playersArray.sort((a, b) => b.coins - a.coins);
        setPlayers(playersArray);
      } else {
        setPlayers([]);
      }
    });
  }, []);

  return (
    <div style={{
      marginTop: "50px",
      backgroundColor: "#1a1a1a",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      color: "white"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Leaderboard</h2>

      {players.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: "10px", borderBottom: "1px solid white" }}>Rank</th>
              <th style={{ paddingBottom: "10px", borderBottom: "1px solid white" }}>Username</th>
              <th style={{ paddingBottom: "10px", borderBottom: "1px solid white" }}>Coins</th>
              <th style={{ paddingBottom: "10px", borderBottom: "1px solid white" }}>Level</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.username}>
                <td style={{ textAlign: "center", padding: "8px" }}>{index + 1}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{player.username}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{player.coins}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{player.level || 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Loading leaderboard...
        </p>
      )}
    </div>
  );
}

export default Leaderboard;