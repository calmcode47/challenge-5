import { Environment } from "@react-three/drei/core/Environment.js";
import { Lightformer } from "@react-three/drei/core/Lightformer.js";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { Color, Object3D, type Group, type InstancedMesh, type Mesh } from "three";
import { paletteFor } from "../palette";
import { ORBIT_BOX_COUNT, updateHeroMotion, type SculptureRefs } from "./heroMotion";

/**
 * Procedural studio lighting rig using Lightformers without HDR downloads.
 *
 * @returns JSX.Element
 */
export function HeroLighting(): JSX.Element {
  return (
    <>
      <Environment resolution={64}>
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, -6]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={1.5}
          rotation-y={Math.PI / 2}
          position={[-5, 1, -1]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          intensity={1.5}
          rotation-y={-Math.PI / 2}
          position={[5, 1, -1]}
          scale={[10, 2, 1]}
        />
        <Lightformer intensity={3} color="#F2C879" position={[0, -2, 4]} scale={[5, 5, 1]} />
      </Environment>
      <pointLight position={[2, 3, 4]} intensity={2.5} color="#F2C879" />
      <pointLight position={[-3, -2, -2]} intensity={1.5} color="#9A8CFF" />
    </>
  );
}

/**
 * Procedural celebration geometric meshes: faceted core, dual torus rings, orbit beads.
 *
 * @param props - Sculpture component refs
 * @returns JSX.Element
 */
export function HeroSculpture({
  coreRef,
  ring1Ref,
  ring2Ref,
  orbitRef,
}: SculptureRefs): JSX.Element {
  return (
    <>
      <mesh ref={coreRef} data-testid="hero-core">
        <icosahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial
          metalness={0.6}
          roughness={0.18}
          clearcoat={1.0}
          flatShading
          color="#F2C879"
        />
      </mesh>
      <mesh ref={ring1Ref} data-testid="hero-ring1">
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshStandardMaterial color="#9A8CFF" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]} data-testid="hero-ring2">
        <torusGeometry args={[2.3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#5EEAD4" roughness={0.2} metalness={0.8} />
      </mesh>
      <instancedMesh
        ref={orbitRef}
        args={[undefined, undefined, ORBIT_BOX_COUNT]}
        frustumCulled={false}
        data-testid="hero-orbit"
      >
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial roughness={0.3} metalness={0.7} />
      </instancedMesh>
    </>
  );
}

function useIsLandingRoute(): boolean {
  try {
    return useLocation().pathname === "/";
  } catch {
    return false;
  }
}

/**
 * Procedural celebration sculpture rendered exclusively on the landing route ('/').
 * Composed of a faceted icosahedron core, dual counter-rotating torus rings,
 * and 24 orbiting confetti beads with procedural lighting.
 *
 * @returns JSX.Element | null
 */
export function HeroObject(): JSX.Element | null {
  const isLanding = useIsLandingRoute();
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const orbitRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const refs = useMemo<SculptureRefs>(() => ({ coreRef, ring1Ref, ring2Ref, orbitRef }), []);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (orbit && typeof orbit.setColorAt === "function") {
      const pal = paletteFor("neutral");
      const fallback = new Color(pal[0]);
      const colors = [fallback, new Color(pal[1]), new Color(pal[2])];
      for (let i = 0; i < ORBIT_BOX_COUNT; i += 1) {
        orbit.setColorAt(i, colors[i % colors.length] ?? fallback);
      }
      if (orbit.instanceColor) orbit.instanceColor.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current && isLanding) {
      updateHeroMotion(groupRef.current, refs, dummy, delta, state.clock.getElapsedTime());
    }
  });

  if (!isLanding) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} data-testid="hero-group">
      <HeroLighting />
      <HeroSculpture
        coreRef={refs.coreRef}
        ring1Ref={refs.ring1Ref}
        ring2Ref={refs.ring2Ref}
        orbitRef={refs.orbitRef}
      />
    </group>
  );
}
