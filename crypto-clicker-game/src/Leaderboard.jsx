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
      }
    });
  }, []);

  return (
    <div style={{ marginTop: "50px" }}>
      <h2>Leaderboard</h2>
      <table style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Coins</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.username}>
              <td>{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;