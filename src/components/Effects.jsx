import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

const Effects = () => {
    return (
        <EffectComposer disableNormalPass>
            <Bloom
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
                height={300}
                intensity={0.5}
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    );
};

export default Effects;
