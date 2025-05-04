import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

function Leaderboard({ onBack }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, "players"));
      const playerList = [];
      querySnapshot.forEach((doc) => {
        playerList.push(doc.data());
      });

      // Sort by coins descending
      playerList.sort((a, b) => b.coins - a.coins);
      setPlayers(playerList);
    };

    fetchPlayers();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h1 style={{
        fontSize: "28px",
        fontWeight: "bold",
        color: "#ffffff",
        textShadow: "0 0 10px #00f7ff, 0 0 20px #00f7ff, 0 0 30px #00f7ff",
      }}>
        Leaderboard
      </h1>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={onBack}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Back to Game
      </motion.button>

      {players.length > 0 ? (
        <motion.table
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "90%",
            marginTop: "30px",
            marginLeft: "auto",
            marginRight: "auto",
            borderCollapse: "collapse",
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          <thead style={{ backgroundColor: "#333" }}>
            <tr>
              <th style={{ padding: "12px" }}>Rank</th>
              <th style={{ padding: "12px" }}>Username</th>
              <th style={{ padding: "12px" }}>Coins</th>
              <th style={{ padding: "12px" }}>Level</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ padding: "10px" }}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </td>
                <td style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src={player.profilePicture || "https://i.postimg.cc/Y9n6f0DC/default-avatar.png"} 
                    alt="PFP" 
                    style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px" }} 
                  />
                  {player.username}
                </td>
                <td style={{ padding: "10px" }}>{Math.floor(player.coins)}</td>
                <td style={{ padding: "10px" }}>{player.level || 0}</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <p>Loading players...</p>
      )}
    </motion.div>
  );
}

export default Leaderboard;