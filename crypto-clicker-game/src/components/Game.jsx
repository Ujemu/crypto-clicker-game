import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = ({ user }) => {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);

  const handleClick = () => {
    setClicks(prev => prev + multiplier);
  };

  // Auto-click logic
  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prev => prev + autoClickers);
    }, 2000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  return (
    <div className="game-container">
      <h2>Welcome, {user}</h2>
      <h1 className="score">Coins: {clicks}</h1>
      <button className="click-button" onClick={handleClick}>Click Me!</button>
      <div className="upgrades">
        <button onClick={() => setMultiplier(prev => prev + 1)}>
          Upgrade Multiplier (x{multiplier})
        </button>
        <button onClick={() => setAutoClickers(prev => prev + 1)}>
          Add Auto-Clicker ({autoClickers})
        </button>
      </div>
    </div>
  );
};

export default Game;
// this is just a trigger for redeploy