import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { Group } from 'three';

const green = '#245b47';
const cream = '#f4dfaa';
const terracotta = '#b85c38';

/** A friendly procedural cow that gives the landing page a living focal point. */
export function CowModel({ animated = true }: { animated?: boolean }) {
  const cow = useRef<Group>(null);
  const tail = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!animated) return;
    if (cow.current) {
      cow.current.position.y = -0.5 + Math.sin(clock.elapsedTime * 1.7) * 0.035;
      cow.current.rotation.y = -0.22 + Math.sin(clock.elapsedTime * 0.7) * 0.08;
    }
    if (tail.current) tail.current.rotation.z = Math.sin(clock.elapsedTime * 3) * 0.3;
  });
  return (
    <group ref={cow} position={[0.15, -0.5, 0.6]} rotation={[0, -0.22, 0]}>
      <mesh castShadow scale={[1.15, 0.7, 0.62]}>
        <sphereGeometry args={[0.7, 20, 14]} /><meshStandardMaterial color="#f7f0dd" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.22, 0.12, 0.57]} scale={[0.28, 0.2, 0.04]}>
        <sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#49382f" />
      </mesh>
      <group position={[0.82, 0.18, 0]}>
        <mesh castShadow scale={[0.42, 0.42, 0.38]}>
          <sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#f7f0dd" roughness={0.8} />
        </mesh>
        <mesh position={[0.34, -0.12, 0]} scale={[0.25, 0.2, 0.28]}>
          <sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#dca9a0" />
        </mesh>
        {[-0.19, 0.19].map((z) => <mesh key={z} position={[0.36, 0.04, z]}><sphereGeometry args={[0.035, 10, 8]} /><meshStandardMaterial color="#17251f" /></mesh>)}
        {[-0.42, 0.42].map((z) => <mesh key={z} position={[0, 0.2, z]} scale={[0.23, 0.08, 0.13]}><sphereGeometry args={[1, 10, 7]} /><meshStandardMaterial color="#49382f" /></mesh>)}
      </group>
      {[-0.48, 0.48].flatMap((x) => [-0.34, 0.34].map((z) => (
        <mesh key={`${x}-${z}`} castShadow position={[x, -0.62, z]}>
          <cylinderGeometry args={[0.075, 0.09, 0.72, 9]} /><meshStandardMaterial color="#eee2c8" />
        </mesh>
      )))}
      <group ref={tail} position={[-0.82, 0.15, 0]} rotation={[0, 0, -0.5]}>
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.025, 0.55, 8]} /><meshStandardMaterial color="#49382f" /></mesh>
      </group>
    </group>
  );
}

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
          <CowModel animated={!reducedMotion} />
          <CoinStackModel animated={!reducedMotion} />
        </Float>
        <ContactShadows position={[0, -1.05, 0]} opacity={0.28} scale={6} blur={2.4} />
      </Canvas>
      <span className="scene-caption">Der Markt ist eröffnet</span>
    </div>
  );
}
