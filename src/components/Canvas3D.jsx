import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed, factor }) => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Subtle rotation
        meshRef.current.rotation.x = Math.cos(t / 4) / 2;
        meshRef.current.rotation.y = Math.sin(t / 4) / 2;
        meshRef.current.rotation.z = Math.sin(t / 1.5) / 2;
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * factor;
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[1, 32, 32]} />
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={0.75}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.1}
                />
            </mesh>
        </Float>
    );
};

const AnimatedBackground = () => {
    // Generate some random positions for particles or small spheres
    const particleCount = 20;
    const particles = useMemo(() => {
        return new Array(particleCount).fill().map(() => ({
            position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
            scale: Math.random() * 0.2 + 0.05
        }));
    }, []);

    return (
        <group>
            {particles.map((p, i) => (
                <mesh key={i} position={p.position} scale={p.scale}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    )
}

const Canvas3D = () => {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00cc" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <FloatingShape position={[-2, 0, 0]} color="#ff00cc" speed={1.5} factor={0.5} />
                <FloatingShape position={[2, 1, -2]} color="#6600ff" speed={2} factor={0.3} />
                <FloatingShape position={[0, -2, -1]} color="#00ffff" speed={1} factor={1} />

                <AnimatedBackground />

                {/* <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} /> */}
                {/* Disabling OrbitControls to keep it as a background, or enable with limits if user wants interaction */}
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
            </Canvas>
        </div>
    );
};

export default Canvas3D;
