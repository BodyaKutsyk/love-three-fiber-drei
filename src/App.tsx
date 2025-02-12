import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { WordsAroundHeart } from './components/Three';

import './App.scss';
import { OrbitControls, Stars, TrackballControls } from '@react-three/drei';
import { Button } from './components/Button';
import React from 'react';

export const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: false }}
        className="three-canvas-container"
        frameloop="demand"
      >
        <Suspense fallback={null}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <color attach="background" args={['#000914']} />
          <ambientLight />

          {isOpen && <WordsAroundHeart />}
          <Stars saturation={1} count={500} speed={1} />
          {!isOpen && <Button setIsOpen={setIsOpen} />}

          <OrbitControls
            enableRotate={true}
            rotateSpeed={0.5}
            minDistance={50}
            maxDistance={350}
          />
        </Suspense>
        <TrackballControls />
      </Canvas>
    </>
  );
};
