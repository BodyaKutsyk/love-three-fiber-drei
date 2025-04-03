import * as THREE from 'three';
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Billboard, PerspectiveCamera, Text } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const myWords = [
  'Люблю тебе',
  'will you be my Valentine?',
  'Te amo',
  'Je t’aime',
  'Ich liebe dich',
  '愛してます',
  '나도 사랑해요',
  'Σε αγαπώ',
  'Ti amo',
];

const Word = React.memo(({ children, ...props }) => {
  const fontProps = {
    font: 'fonts/BalsamiqSans-Regular.ttf',
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 2.5,
    'material-toneMapped': false,
  };
  const ref = useRef();

  useFrame(({ camera }) => {
    if (ref.current) {
      const textPosition = new THREE.Vector3();

      ref.current.getWorldPosition(textPosition);

      const distance = camera.position.distanceTo(textPosition);

      const farDistance = 200;
      const nearDistance = 100;

      const t = THREE.MathUtils.smoothstep(
        (distance - nearDistance) / (farDistance - nearDistance),
        0,
        1,
      );

      const softPink = new THREE.Color('#FFC0CB');
      const softRed = new THREE.Color('#ff4432');

      const targetColor = softPink.clone().lerp(softRed, 1 - t);

      ref.current.material.color.copy(targetColor);
    }
  });

  return (
    <Billboard {...props}>
      <Text ref={ref} {...fontProps} material={new THREE.MeshBasicMaterial()}>
        {children}
      </Text>
    </Billboard>
  );
});

Word.displayName = 'Word';

export const WordsAroundHeart = React.memo(() => {
  const heart = useLoader(OBJLoader, './models/Love.obj');
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  useMemo(() => {
    const box = new THREE.Box3().setFromObject(heart);
    const center = box.getCenter(new THREE.Vector3());

    heart.traverse(child => {
      if (child.isMesh) {
        child.geometry.translate(-center.x, -center.y, -center.z);
      }
    });

    return center;
  }, [heart]);

  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 200);
      cameraRef.current.lookAt(0, 0, 0);

      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [heart]);

  const words = useMemo(() => {
    const vertices = [];
    const placedPositions = [];
    const numWords = 500;
    const minDistance = 2.5;

    heart.traverse(child => {
      if (child.isMesh) {
        const position = child.geometry.attributes.position;

        for (
          let i = 0;
          i < position.count;
          i += Math.floor(position.count / numWords)
        ) {
          const newPos = new THREE.Vector3(
            position.getX(i * 2),
            position.getY(i * 2),
            position.getZ(i * 2),
          );

          if (placedPositions.every(p => p.distanceTo(newPos) > minDistance)) {
            vertices.push(newPos);
            placedPositions.push(newPos);
          }

          if (vertices.length >= numWords) {
            break;
          }
        }
      }
    });

    return vertices.map(pos => [
      pos,
      myWords[Math.floor(Math.random() * myWords.length)],
    ]);
  }, [heart]);

  return (
    <>
      {words.slice(0, 500).map(([pos, word], index) => (
        <Word key={index} position={pos}>
          {word}
        </Word>
      ))}
      <PerspectiveCamera
        ref={cameraRef}
        position={[0, 0, 400]}
        makeDefault
        aspect={1.6}
      />
    </>
  );
});

WordsAroundHeart.displayName = 'WordsAroundHeart';
