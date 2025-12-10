import React, { useState } from 'react';
import MassScene, { MovieOverlay } from './components/MassScene';
import LandingOverlay from './components/LandingOverlay';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeTheme, setActiveTheme] = useState('MYSTERY'); // Default to landing theme

  const handleEnter = () => {
    setHasEntered(true);
    setActiveTheme('HORROR'); // Intro into Horror
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* The Continuous 3D World */}
      <MassScene activeTheme={activeTheme} />

      {/* Overlays Layer */}
      {!hasEntered ? (
        <LandingOverlay onEnter={handleEnter} />
      ) : (
        <MovieOverlay activeTheme={activeTheme} setActiveTheme={setActiveTheme} />
      )}
    </div>
  );
}

export default App;
