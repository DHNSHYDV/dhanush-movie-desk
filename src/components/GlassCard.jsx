import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, title, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={`glass-panel ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      {title && <h2>{title}</h2>}
      {children}
    </motion.div>
  );
};

export default GlassCard;
