import React from 'react';
import { motion } from 'framer-motion';

const LandingOverlay = ({ onEnter }) => {
    // Stagger animation for the title
    const sentence = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                staggerChildren: 0.08
            }
        }
    }
    const letter = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
        }
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
        }}>
            <motion.div
                variants={sentence}
                initial="hidden"
                animate="visible"
                style={{ textAlign: 'center' }}
            >
                <h1 style={{
                    color: 'white',
                    fontSize: '4rem', // Slightly smaller to fit full name if needed, or keeping it "Mass"
                    fontWeight: 300,
                    margin: 0,
                    letterSpacing: '0.5rem',
                    textTransform: 'uppercase',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    maxWidth: '80vw'
                }}>
                    {/* Split text for effect */}
                    {"DHANUSH'S MOVIE DESK".split("").map((char, index) => (
                        <motion.span key={char + "-" + index} variants={letter}>
                            {char}
                        </motion.span>
                    ))}
                </h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '200px' }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{
                        height: '2px',
                        background: 'white',
                        margin: '2rem auto',
                        opacity: 0.5
                    }}
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 2, duration: 1 }}
                    style={{
                        color: 'rgba(255,255,255,0.8)',
                        letterSpacing: '0.3rem',
                        fontSize: '1rem',
                        textTransform: 'uppercase'
                    }}>
                    Curated Cinematic Experience
                </motion.p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                onClick={onEnter}
                style={{
                    marginTop: '4rem',
                    padding: '1rem 3rem',
                    background: 'rgba(255,255,255,0.0)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    color: 'white',
                    fontSize: '0.9rem',
                    letterSpacing: '0.3rem',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease'
                }}
                whileHover={{
                    background: 'rgba(255,255,255,1)',
                    color: 'black',
                    scale: 1.1,
                    letterSpacing: '0.5rem'
                }}
                whileTap={{ scale: 0.95 }}
            >
                Start Show
            </motion.button>
        </div>
    );
};

export default LandingOverlay;
