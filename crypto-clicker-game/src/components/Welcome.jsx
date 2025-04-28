import { motion } from 'framer-motion';
import { useEffect } from 'react';

function Welcome({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // move to login after 10 seconds
    }, 10000); // 10 seconds
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
      fontSize: '28px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <motion.img
        src="https://i.postimg.cc/CMZKymWb/DEGEN.jpg"
        alt="Web3Degen Profile"
        style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Game By Web3degen Loading....
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        style={{ marginTop: "20px", fontSize: "24px" }}
      >
        ⏳
      </motion.div>
    </div>
  );
}

export default Welcome;