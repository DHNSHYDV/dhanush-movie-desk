import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Effects from './Effects';

const Bullet = ({ position, rotation }) => {
    const ref = useRef();
    const speed = 1.5;

    useFrame(() => {
        if (ref.current) {
            ref.current.translateZ(-speed);
        }
    });

    return (
        <mesh ref={ref} position={position} rotation={rotation}>
            <capsuleGeometry args={[0.1, 1, 4, 8]} />
            <meshBasicMaterial color="#00ffcc" toneMapped={false} />
        </mesh>
    );
};

const Target = ({ position }) => {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ref.current.rotation.x = Math.sin(t) * 0.5;
        ref.current.rotation.y = t;
    })
    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} toneMapped={false} roughness={0.2} metalness={0.8} />
        </mesh>
    )
}

const PlayerGun = ({ onFire }) => {
    const group = useRef();
    const { camera, mouse } = useThree();

    useFrame(() => {
        if (group.current) {
            const x = mouse.x * 2;
            const y = mouse.y * 2;
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -x * 0.5, 0.1);
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.2, 0.1);
            group.current.position.set(camera.position.x + 0.5, camera.position.y - 0.5, camera.position.z - 1);
        }
    });

    useEffect(() => {
        const handleClick = () => {
            if (group.current) {
                const position = group.current.getWorldPosition(new THREE.Vector3());
                onFire({ position: [position.x, position.y, position.z], rotation: [group.current.rotation.x, group.current.rotation.y, 0] });
                group.current.position.z += 0.2;
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [onFire]);

    return (
        <group ref={group}>
            <mesh position={[0, 0, -0.5]}>
                <boxGeometry args={[0.2, 0.3, 1]} />
                <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.1, -0.5]}>
                <boxGeometry args={[0.1, 0.1, 1.02]} />
                <meshBasicMaterial color="#00ffcc" />
            </mesh>
            <pointLight position={[0, 0, -1]} distance={2} intensity={2} color="#00ffcc" />
        </group>
    );
};

const GameContent = () => {
    const [bullets, setBullets] = useState([]);

    const handleFire = (bulletData) => {
        setBullets(prev => [...prev, { id: Date.now(), ...bulletData }]);
    };

    useFrame(() => {
        if (bullets.length > 20) {
            setBullets(prev => prev.slice(1));
        }
    });

    return (
        <>
            <Effects />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#44aaff" />

            <gridHelper args={[50, 50, 0x444444, 0x222222]} position={[0, -2, 0]} />
            <fog attach="fog" args={['#050505', 5, 20]} />
            <color attach="background" args={['#050505']} />

            <PlayerGun onFire={handleFire} />

            {bullets.map(b => (
                <Bullet key={b.id} position={b.position} rotation={b.rotation} />
            ))}

            <Target position={[0, 0, -10]} />
            <Target position={[-5, 2, -15]} />
            <Target position={[5, -1, -8]} />
        </>
    );
};

const ShooterScene = () => {
    return (
        <div className="canvas-container">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <GameContent />
            </Canvas>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(0, 255, 204, 0.5)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 10px #00ffcc'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                width: '100%',
                textAlign: 'center',
                color: '#00ffcc',
                fontFamily: 'monospace',
                textShadow: '0 0 5px #00ffcc',
                pointerEvents: 'none'
            }}>
                CLICK TO SHOOT // TARGETS LOCKED
            </div>
        </div>
    );
};

export default ShooterScene;
