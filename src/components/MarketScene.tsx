import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { Group } from 'three';

const green = '#245b47';
const cream = '#f4dfaa';
const terracotta = '#b85c38';

/** A small low-poly barn assembled from accessible, fast-loading primitives. */
export function BarnModel() {
  return (
    <group position={[-1.45, -0.45, 0]} rotation={[0, 0.18, 0]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[1.25, 1.1, 0.9]} />
        <meshStandardMaterial color={terracotta} roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, 1.18, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.9, 0.9, 0.95]} />
        <meshStandardMaterial color={green} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.34, 0.46]}>
        <boxGeometry args={[0.42, 0.68, 0.025]} />
        <meshStandardMaterial color={cream} />
      </mesh>
    </group>
  );
}

/** A tabletop auction gavel, kept geometric so it renders without model downloads. */
export function GavelModel() {
  return (
    <group position={[0.05, 0, 0.15]} rotation={[0.15, 0.15, -0.65]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.85, 12]} />
        <meshStandardMaterial color="#7c452d" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.9, 12]} />
        <meshStandardMaterial color="#a6653e" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** A stack of Kuhhandel coins with a subtle idle rotation. */
export function CoinStackModel({ animated = true }: { animated?: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (animated && group.current) group.current.rotation.y += delta * 0.28;
  });
  return (
    <group ref={group} position={[1.4, -0.55, 0.15]}>
      {[0, 0.12, 0.24, 0.36].map((height, index) => (
        <mesh key={height} castShadow position={[index % 2 ? 0.06 : 0, height, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.1, 24]} />
          <meshStandardMaterial color="#d69e3a" metalness={0.45} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function MarketScene() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="market-scene" role="img" aria-label="Dreidimensionale Szene mit Scheune, Auktionshammer und Münzen">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.7, 5.4], fov: 42 }} shadows>
        <color attach="background" args={['#e9e5d8']} />
        <ambientLight intensity={1.8} />
        <directionalLight castShadow intensity={2.5} position={[3, 5, 4]} />
        <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.08} floatIntensity={reducedMotion ? 0 : 0.18}>
          <BarnModel />
          <GavelModel />
          <CoinStackModel animated={!reducedMotion} />
        </Float>
        <ContactShadows position={[0, -1.05, 0]} opacity={0.28} scale={6} blur={2.4} />
      </Canvas>
      <span className="scene-caption">Der Markt ist eröffnet</span>
    </div>
  );
}
