import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { easing } from 'maath';

// --- Configuration for Movies ---
// --- Configuration for Genres ---
export const THEMES = {
    MYSTERY: {
        colors: ['#ffffff', '#a0a0a0', '#404040'], // Silver & Fog
        speed: 0.2,
        dispersion: 0.5,
        size: 0.1,
        count: 1000
    },
    HORROR: {
        colors: ['#000000', '#1a0000', '#8a0000', '#ff0000'], // Blood & Shadow
        speed: 0.5,
        dispersion: 1.5,
        size: 0.15,
        count: 3500
    },
    THRILLER: {
        colors: ['#1c1c1c', '#2c3e50', '#e74c3c'], // Noir with red accents
        speed: 2.0,
        dispersion: 0.8,
        size: 0.12,
        count: 3000
    },
    'SCI-FI': {
        colors: ['#00ff00', '#00ffff', '#ff00ff', '#ffffff'], // Cyberpunk Neon
        speed: 1.2,
        dispersion: 1.0,
        size: 0.15,
        count: 2500
    },
    'FEEL GOOD': {
        colors: ['#fff176', '#4dd0e1', '#f06292', '#ffffff'], // Pastels & Sunshine
        speed: 0.6,
        dispersion: 2.0,
        size: 0.2, // Fluffy
        count: 2000
    },
    EMOTION: {
        colors: ['#311b92', '#4a148c', '#880e4f', '#ffd700'], // Deep purple, gold, royal
        speed: 0.4,
        dispersion: 0.5,
        size: 0.1,
        count: 4000
    }
};

const Particles = ({ themeName }) => {
    const mesh = useRef();
    const { viewport, mouse } = useThree();
    const theme = THEMES[themeName] || THEMES['MYSTERY'];

    // Initialize Particles
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 4000; i++) { // Max count
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            const mx = 0;
            const my = 0;
            // Velocity vectors
            const vx = (Math.random() - 0.5) * 0.1;
            const vy = (Math.random() - 0.5) * 0.1;
            const vz = (Math.random() - 0.5) * 0.1;

            temp.push({ t, factor, speed, x, y, z, mx, my, vx, vy, vz, originalColor: new THREE.Color() });
        }
        return temp;
    }, []);

    // Color handling
    useEffect(() => {
        if (!mesh.current) return;
        const color = new THREE.Color();

        for (let i = 0; i < theme.count; i++) {
            // Pick rand color from theme
            const colorHex = theme.colors[Math.floor(Math.random() * theme.colors.length)];
            color.set(colorHex);
            particles[i].originalColor = color;
            mesh.current.setColorAt(i, color);
        }
        // Hide unused particles
        for (let i = theme.count; i < 4000; i++) {
            mesh.current.setColorAt(i, new THREE.Color('#000000'));
        }
        mesh.current.instanceColor.needsUpdate = true;
    }, [themeName]);

    useFrame((state, delta) => {
        // Animation Loop
        particles.forEach((particle, i) => {
            if (i >= theme.count) return; // Skip unused

            let { t, factor, speed, x, y, z } = particle;

            // 1. Natural Swirl
            const time = state.clock.elapsedTime;
            // Basic orbit
            const tx = Math.cos(t) + Math.sin(t * 1) / 10;
            const ty = Math.sin(t) + Math.cos(t * 2) / 10;
            const tz = Math.cos(t) + Math.sin(t * 3) / 10;

            // 2. Mouse Interaction (Repulsion)
            // Convert mouse to world space roughly (at z=0)
            const mx = (mouse.x * viewport.width) / 2;
            const my = (mouse.y * viewport.height) / 2;

            // Distance to mouse
            const dx = particle.x - mx;
            const dy = particle.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Repel force
            let force = 0;
            if (dist < 5) {
                force = (5 - dist) * 2; // Strong repulsion
            }

            // Apply forces
            particle.t += speed * theme.speed;
            particle.x += (tx * 0.01) + (dx / dist * force * 0.05);
            particle.y += (ty * 0.01) + (dy / dist * force * 0.05);
            particle.z += (tz * 0.01);

            // Rotation/Position Update
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.setScalar(theme.size + Math.sin(t) * 0.05); // Pulse
            dummy.rotation.set(t * 0.5, t * 0.5, t * 0.5);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);

            // Reset if too far
            if (Math.abs(particle.x) > 20 || Math.abs(particle.y) > 20) {
                particle.x = (Math.random() - 0.5) * 10;
                particle.y = (Math.random() - 0.5) * 10;
                particle.z = (Math.random() - 0.5) * 10;
            }
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, 4000]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
    );
};

// UI Overlay Component
export const MovieOverlay = ({ activeTheme, setActiveTheme }) => {
    // Filter out MYSTERY from the selection list
    const genres = Object.keys(THEMES).filter(k => k !== 'MYSTERY');

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 10
        }}>
            {/* Navigation Dots */}
            <div style={{
                position: 'absolute',
                bottom: '10%',
                display: 'flex',
                gap: '2rem',
                pointerEvents: 'auto'
            }}>
                {genres.map((key) => (
                    <button
                        key={key}
                        onClick={() => setActiveTheme(key)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTheme === key ? 'white' : 'rgba(255,255,255,0.3)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            letterSpacing: '0.2rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* Main Title */}
            <div style={{ textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '8rem',
                    lineHeight: '0.8',
                    margin: 0,
                    fontWeight: 900,
                    letterSpacing: '-0.3rem',
                    textShadow: '0 0 50px rgba(255,255,255,0.2)'
                }}>
                    {activeTheme}
                </h1>
                <p style={{
                    fontSize: '0.9rem',
                    opacity: 0.7,
                    letterSpacing: '0.5rem',
                    marginTop: '1rem'
                }}>
                    DHANUSH'S MOVIE DESK
                </p>
            </div>

        </div>
    );
};

const MassScene = ({ activeTheme = 'MYSTERY' }) => {
    return (
        <div className="canvas-container" style={{ background: 'black', width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <color attach="background" args={['#050505']} />

                <Particles themeName={activeTheme} />

                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0} mipmapBlur intensity={1.5} radius={0.6} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default MassScene;
