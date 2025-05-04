import { motion } from 'framer-motion';
import './Splash.css';

function Splash() {
  return (
    <motion.div
      className="splash-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 10, duration: 1 }}
    >
      <div className="splash-content">
        <img src="https://i.postimg.cc/fRLsvvs4/DEGEN.jpg" alt="Web3degen" className="splash-pfp" />
        <h1 className="splash-title">Game by <span className="highlight">Web3degen</span></h1>
        <div className="loader"></div>
      </div>
    </motion.div>
  );
}

export default Splash;