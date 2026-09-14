import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, OrbitControls, RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import type { Group } from 'three';

type Animal = 'cow' | 'horse' | 'sheep';
type CardProps = { accent: string; position: [number, number, number]; rotation: [number, number, number]; animal: Animal };

const material = (color: string) => <meshStandardMaterial color={color} roughness={0.72} />;

function Leg({ x, z, color }: { x: number; z: number; color: string }) {
  return <mesh position={[x, -0.38, z]} scale={[0.09, 0.46, 0.09]}><capsuleGeometry args={[1, 1.6, 5, 10]} />{material(color)}</mesh>;
}

/** Low-poly, full-body silhouettes made entirely from geometry so the scene works offline. */
function AnimalSilhouette({ animal, color }: { animal: Animal; color: string }) {
  const wool = animal === 'sheep';
  const horse = animal === 'horse';
  return (
    <group position={[0, 0.18, 0.13]} rotation={[0.08, -0.38, 0]} scale={horse ? 0.48 : 0.5}>
      <mesh scale={wool ? [0.84, 0.62, 0.48] : [0.88, 0.52, 0.45]}>{wool ? <dodecahedronGeometry args={[1, 1]} /> : <sphereGeometry args={[1, 18, 12]} />}{material(color)}</mesh>
      {[[-0.5, .25], [-0.5, -.25], [.5, .25], [.5, -.25]].map(([x, z], i) => <Leg key={i} x={x} z={z} color={color} />)}
      <group position={[horse ? 0.82 : 0.72, horse ? 0.47 : 0.28, 0]} rotation={[0, 0, horse ? -0.22 : 0]}>
        {horse && <mesh position={[-0.18, -0.22, 0]} rotation={[0, 0, -0.35]} scale={[0.19, 0.55, 0.2]}><capsuleGeometry args={[1, 1.5, 6, 12]} />{material(color)}</mesh>}
        <mesh scale={horse ? [0.37, 0.5, 0.34] : [0.46, 0.42, 0.38]}><sphereGeometry args={[1, 16, 10]} />{material(color)}</mesh>
        {[-1, 1].map(side => <mesh key={side} position={[0, .38, side * .25]} rotation={[side * .35, 0, side * .25]} scale={[.11, .3, .13]}><coneGeometry args={[1, 1.8, 5]} />{material(color)}</mesh>)}
        {animal === 'cow' && [-1, 1].map(side => <mesh key={side} position={[.02, .42, side * .34]} rotation={[side * .55, 0, 0]} scale={[.055, .3, .055]}><coneGeometry args={[1, 1.4, 8]} /><meshStandardMaterial color="#efc769" /></mesh>)}
        {wool && <mesh position={[.28, -.12, 0]} scale={[.35, .22, .26]}><sphereGeometry args={[1, 14, 8]} /><meshStandardMaterial color="#40392f" /></mesh>}
      </group>
      <mesh position={[-.93, .2, 0]} rotation={[0, 0, .55]} scale={[.035, .5, .035]}><cylinderGeometry args={[1, 1, 1, 8]} />{material(color)}</mesh>
      {horse && <mesh position={[-.88, .28, 0]} rotation={[0, 0, -.5]} scale={[.22, .48, .3]}><coneGeometry args={[1, 1.8, 8]} />{material('#182f27')}</mesh>}
    </group>
  );
}

function TradingCard({ accent, position, rotation, animal }: CardProps) {
  const card = useRef<Group>(null);
  const kick = useRef(0);
  const [active, setActive] = useState(false);
  useFrame((_, delta) => {
    if (!card.current || kick.current <= 0) return;
    kick.current = Math.max(0, kick.current - delta);
    const progress = 1 - kick.current / 0.9;
    card.current.rotation.y += delta * (10 - progress * 5);
    card.current.position.y = position[1] + Math.sin(progress * Math.PI) * .38;
    card.current.scale.setScalar(1 + Math.sin(progress * Math.PI) * .07);
    if (!kick.current) { card.current.position.y = position[1]; card.current.scale.setScalar(1); setActive(false); }
  });
  const celebrate = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); kick.current = .9; setActive(true); };
  return (
    <group ref={card} position={position} rotation={rotation} onClick={celebrate} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      <RoundedBox args={[1.65, 2.35, 0.12]} radius={0.11} smoothness={5} castShadow>
        <meshPhysicalMaterial color="#fffaf0" roughness={0.38} clearcoat={0.35} emissive={active ? accent : '#000000'} emissiveIntensity={active ? .12 : 0} />
      </RoundedBox>
      <RoundedBox args={[1.42, 1.42, 0.025]} radius={0.08} smoothness={4} position={[0, 0.24, 0.073]}><meshStandardMaterial color={accent} roughness={0.72} /></RoundedBox>
      <AnimalSilhouette animal={animal} color="#fff8e9" />
      <mesh position={[-0.38, -0.73, 0.075]}><boxGeometry args={[0.55, 0.075, 0.02]} /><meshStandardMaterial color="#1d4b3a" /></mesh>
      <mesh position={[-0.5, -0.91, 0.075]}><boxGeometry args={[0.31, 0.04, 0.02]} /><meshStandardMaterial color="#b7b0a0" /></mesh>
      <mesh position={[0.52, -0.84, 0.075]}><cylinderGeometry args={[0.2, 0.2, 0.025, 28]} /><meshStandardMaterial color="#e4b54d" metalness={0.35} /></mesh>
    </group>
  );
}

function CardDeck({ animated }: { animated: boolean }) {
  const deck = useRef<Group>(null);
  useFrame(({ clock }) => { if (animated && deck.current) deck.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.07; });
  return <group ref={deck} rotation={[-0.06, -0.14, 0]}>
    <TradingCard animal="sheep" accent="#d4a346" position={[-1.25, 0, -0.42]} rotation={[0.03, 0.25, -0.18]} />
    <TradingCard animal="horse" accent="#bd6448" position={[1.25, 0, -0.36]} rotation={[0.02, -0.24, 0.18]} />
    <TradingCard animal="cow" accent="#285b48" position={[0, 0.24, 0.15]} rotation={[0, 0, 0]} />
  </group>;
}

export function MarketScene() {
  const reducedMotion = useReducedMotion();
  return <div className="market-scene" role="img" aria-label="Three rotatable animal cards: a cow, horse, and sheep. Drag to rotate them, or tap a card to animate it.">
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.25, 6.3], fov: 38 }} shadows>
      <ambientLight intensity={1.7} /><directionalLight castShadow intensity={3.2} position={[3, 5, 5]} />
      <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={reducedMotion ? 0 : 0.04} floatIntensity={reducedMotion ? 0 : 0.12}><CardDeck animated={!reducedMotion} /></Float>
      <ContactShadows position={[0, -1.75, 0]} opacity={0.3} scale={7} blur={2.8} />
      <OrbitControls makeDefault enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.4} maxPolarAngle={Math.PI / 1.75} autoRotate={!reducedMotion} autoRotateSpeed={0.45} />
    </Canvas>
    <div className="scene-caption"><span className="drag-icon">↔</span> Drag, tap &amp; discover</div>
    <div className="card-count"><strong>3</strong><span>Animals<br />on display</span></div>
  </div>;
}
