import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, OrbitControls, RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { Group } from 'three';

type CardProps = {
  accent: string;
  position: [number, number, number];
  rotation: [number, number, number];
  animal: 'cow' | 'pig' | 'sheep';
};

function AnimalMark({ animal, color }: Pick<CardProps, 'animal' | 'accent'> & { color: string }) {
  const ears = animal === 'pig' ? 0.3 : 0.42;
  return (
    <group position={[0, 0.18, 0.071]}>
      <mesh scale={[0.72, 0.58, 0.1]}><sphereGeometry args={[1, 28, 18]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-ears, 0.48, 0]} rotation={[0, 0, -0.55]} scale={[0.22, 0.38, 0.08]}><coneGeometry args={[1, 1.6, 3]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[ears, 0.48, 0]} rotation={[0, 0, 0.55]} scale={[0.22, 0.38, 0.08]}><coneGeometry args={[1, 1.6, 3]} /><meshStandardMaterial color={color} /></mesh>
      {animal === 'cow' && [-0.54, 0.54].map((x) => <mesh key={x} position={[x, 0.55, 0]} rotation={[0, 0, x < 0 ? 0.5 : -0.5]} scale={[0.08, 0.34, 0.07]}><coneGeometry args={[1, 1, 10]} /><meshStandardMaterial color="#d9ae58" /></mesh>)}
      {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, 0.13, 0.12]}><sphereGeometry args={[0.055, 12, 8]} /><meshStandardMaterial color="#152c24" /></mesh>)}
      <mesh position={[0, -0.18, 0.12]} scale={[0.38, 0.2, 0.08]}><sphereGeometry args={[1, 18, 10]} /><meshStandardMaterial color={animal === 'pig' ? '#d7787c' : '#e2c7a5'} /></mesh>
    </group>
  );
}

function TradingCard({ accent, position, rotation, animal }: CardProps) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.65, 2.35, 0.12]} radius={0.11} smoothness={5} castShadow>
        <meshPhysicalMaterial color="#fffaf0" roughness={0.38} clearcoat={0.35} />
      </RoundedBox>
      <RoundedBox args={[1.42, 1.42, 0.025]} radius={0.08} smoothness={4} position={[0, 0.24, 0.073]}>
        <meshStandardMaterial color={accent} roughness={0.72} />
      </RoundedBox>
      <AnimalMark animal={animal} accent={accent} color="#fff8e9" />
      <mesh position={[-0.38, -0.73, 0.075]}><boxGeometry args={[0.55, 0.075, 0.02]} /><meshStandardMaterial color="#1d4b3a" /></mesh>
      <mesh position={[-0.5, -0.91, 0.075]}><boxGeometry args={[0.31, 0.04, 0.02]} /><meshStandardMaterial color="#b7b0a0" /></mesh>
      <mesh position={[0.52, -0.84, 0.075]}><cylinderGeometry args={[0.2, 0.2, 0.025, 28]} /><meshStandardMaterial color="#e4b54d" metalness={0.35} /></mesh>
    </group>
  );
}

function CardDeck({ animated }: { animated: boolean }) {
  const deck = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (animated && deck.current) deck.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.07;
  });
  return (
    <group ref={deck} rotation={[-0.06, -0.14, 0]}>
      <TradingCard animal="sheep" accent="#d4a346" position={[-1.25, 0, -0.42]} rotation={[0.03, 0.25, -0.18]} />
      <TradingCard animal="pig" accent="#bd6448" position={[1.25, 0, -0.36]} rotation={[0.02, -0.24, 0.18]} />
      <TradingCard animal="cow" accent="#285b48" position={[0, 0.24, 0.15]} rotation={[0, 0, 0]} />
    </group>
  );
}

export function MarketScene() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="market-scene" role="img" aria-label="Drei drehbare Tierkarten. Ziehen, um den Kartenstapel zu drehen.">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.25, 6.3], fov: 38 }} shadows>
        <ambientLight intensity={1.7} />
        <directionalLight castShadow intensity={3.2} position={[3, 5, 5]} />
        <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={reducedMotion ? 0 : 0.04} floatIntensity={reducedMotion ? 0 : 0.12}>
          <CardDeck animated={!reducedMotion} />
        </Float>
        <ContactShadows position={[0, -1.75, 0]} opacity={0.3} scale={7} blur={2.8} />
        <OrbitControls makeDefault enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.4} maxPolarAngle={Math.PI / 1.75} autoRotate={!reducedMotion} autoRotateSpeed={0.45} />
      </Canvas>
      <div className="scene-caption"><span className="drag-icon">↔</span> Ziehen &amp; entdecken</div>
      <div className="card-count"><strong>10</strong><span>Tiere<br />im Deck</span></div>
    </div>
  );
}
