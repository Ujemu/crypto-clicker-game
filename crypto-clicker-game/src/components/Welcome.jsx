import { motion } from 'framer-motion';
import { useEffect } from 'react';

function Welcome({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // move to login after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#121212',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '36px',
      fontWeight: 'bold',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        Welcome to Web3degen Game!
      </motion.div>
    </div>
  );
}

export default Welcome;