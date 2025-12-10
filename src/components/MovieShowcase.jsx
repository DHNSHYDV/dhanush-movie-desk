import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

// Movie Data
const MOVIES = [
    { title: "RRR", color: "#d32f2f", subt: "Rise Roar Revolt" },
    { title: "KGF", color: "#ffb300", subt: "Chapter 2" },
    { title: "PUSHPA", color: "#d84315", subt: "The Rise" },
    { title: "KANTARA", color: "#2e7d32", subt: "A Legend" },
    { title: "BAAHUBALI", color: "#5e35b1", subt: "The Beginning" },
    { title: "VIKRAM", color: "#424242", subt: "Hitlist" },
];

const MovieCard = ({ index, title, color, subt, count, radius = 8, setHover }) => {
    const group = useRef();

    // Calculate position in the circle
    const angle = (index / count) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    useFrame((state, delta) => {
        if (!group.current) return;

        // Look at center (camera default pos is near center mostly?)
        // Actually for a carousel we want them facing outwards or inwards.
        // Let's face them towards the center (0,0,0) so camera inside sees them, or face OUT
        // Let's try facing OUT first so we orbit AROUND them? 
        // Or we sit in center and look around?
        // Let's sit in center (VR style) -> Face IN.
        // position is x, z.
        group.current.position.set(x, 0, z);
        group.current.lookAt(0, 0, 0);

        // Add a slight floating wobble
        // group.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.002;
    });

    return (
        <group
            ref={group}
            onPointerOver={() => setHover(index)}
            onPointerOut={() => setHover(null)}
        >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Center>
                    {/* 3D Title */}
                    <Text3D
                        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                        size={1.5}
                        height={0.5}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.1}
                        bevelSize={0.05}
                        bevelOffset={0}
                        bevelSegments={5}
                    >
                        {title}
                        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
                    </Text3D>

                    {/* Subtitle */}
                    <Text3D
                        font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                        size={0.3}
                        height={0.1}
                        position={[0, -1.2, 0]}
                    >
                        {subt}
                        <meshStandardMaterial color="white" />
                    </Text3D>
                </Center>
            </Float>
        </group>
    );
};

const Carousel = ({ setBgColor }) => {
    const group = useRef();
    const [hovered, setHover] = useState(null);
    const [rotation, setRotation] = useState(0);

    useFrame((state, delta) => {
        // Continuous slow rotation if not hovering
        if (hovered === null) {
            setRotation(r => r + delta * 0.1);
        } else {
            // If hovering, maybe rotate TO that item?
            // For now let's just pause
            // Update BG color logic here or in parent
            setBgColor(MOVIES[hovered].color);
        }

        easing.dampE(group.current.rotation, [0, rotation, 0], 0.25, delta);
    });

    // Reset BG if not hovering
    useFrame((state, delta) => {
        if (hovered === null) {
            // Default dark BG
            setBgColor('#101010');
        }
    });

    return (
        <group ref={group}>
            {MOVIES.map((movie, i) => (
                <MovieCard
                    key={i}
                    {...movie}
                    index={i}
                    count={MOVIES.length}
                    setHover={setHover}
                />
            ))}
        </group>
    );
};

const MovieShowcase = () => {
    const [bgColor, setBgColor] = useState('#101010');

    return (
        <div className="canvas-container" style={{ background: 'black' }}>
            <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
                {/* Dynamic Background Color */}
                <color attach="background" args={[bgColor]} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

                {/* Content */}
                <Carousel setBgColor={setBgColor} />

                {/* Atmosphere */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={500} scale={20} size={4} speed={0.4} opacity={0.5} color="gold" />

                <Environment preset="city" />
            </Canvas>

            <div style={{
                position: 'absolute',
                top: '5%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                textAlign: 'center',
                color: 'white',
                pointerEvents: 'none'
            }}>
                <h1 style={{
                    fontSize: '1rem',
                    letterSpacing: '0.5rem',
                    textTransform: 'uppercase',
                    opacity: 0.7
                }}>South Cinema Universe</h1>
            </div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                pointerEvents: 'none'
            }}>
                Drag to rotate • Hover to pause
            </div>
        </div>
    );
};

export default MovieShowcase;
