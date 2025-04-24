import React, { useState, useEffect } from 'react';

const Game = ({ user }) => {
  const [clicks, setClicks] = useState(() => Number(localStorage.getItem('clicks')) || 0);
  const [multiplier, setMultiplier] = useState(() => Number(localStorage.getItem('multiplier')) || 1);
  const [autoClickers, setAutoClickers] = useState(() => Number(localStorage.getItem('autoClickers')) || 0);

  const handleClick = () => setClicks(prev => prev + multiplier);

  const buyMultiplier = () => {
    if (clicks >= 10) {
      setClicks(prev => prev - 10);
      setMultiplier(prev => prev + 1);
    }
  };

  const buyAutoClicker = () => {
    if (clicks >= 50) {
      setClicks(prev => prev - 50);
      setAutoClickers(prev => prev + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prev => prev + autoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  useEffect(() => {
    localStorage.setItem('clicks', clicks);
    localStorage.setItem('multiplier', multiplier);
    localStorage.setItem('autoClickers', autoClickers);
  }, [clicks, multiplier, autoClickers]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1>Welcome, {user}!</h1>
      <h2 style={{ marginBottom: '30px' }}>Coins: {clicks}</h2>

      <button onClick={handleClick} style={{
        padding: '15px 30px',
        fontSize: '20px',
        marginBottom: '30px',
        borderRadius: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
      }}>
        Click Me!
      </button>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button onClick={buyMultiplier} style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Buy Multiplier (10 coins)
        </button>
        <button onClick={buyAutoClicker} style={{
          padding: '10px 20px',
          backgroundColor: '#ffc107',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Buy Auto-Clicker (50 coins)
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p>Multiplier: {multiplier}</p>
        <p>Auto-Clickers: {autoClickers}</p>
      </div>
    </div>
  );
};

export default Game;