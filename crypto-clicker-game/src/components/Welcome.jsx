import { useEffect } from 'react';
import { motion } from 'framer-motion';

function Welcome({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Move to Login after 10 seconds
    }, 10000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '20px'
    }}>
      {/* Your PFP Image */}
      <motion.img
        src="https://i.postimg.cc/CMZKymWb/DEGEN.jpg"
        alt="Web3degen"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '20px',
          boxShadow: '0 0 20px #00f7ff, 0 0 30px #00f7ff'
        }}
      />

      {/* Game by Web3degen Text */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}
      >
        Game by Web3degen
      </motion.h1>

      {/* Loading animation */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ marginTop: '30px', fontSize: '18px', color: '#4CAF50' }}
      >
        Loading...
      </motion.div>
    </div>
  );
}

export default Welcome;