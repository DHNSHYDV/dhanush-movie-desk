import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

const SpinningCube = () => {
    const mesh = useRef();
    useFrame((state, delta) => {
        mesh.current.rotation.x += delta;
        mesh.current.rotation.y += delta;
    });
    return (
        <mesh ref={mesh}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

const LabourScene = () => {
    return (
        <div className="canvas-container">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {/* Minimal Reproduction */}
                <SpinningCube />

                <OrbitControls />
                <color attach="background" args={['#200040']} />
            </Canvas>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                pointerEvents: 'none'
            }}>
                <h1>TEST CUBE</h1>
            </div>
        </div>
    );
};

export default LabourScene;
