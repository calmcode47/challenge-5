import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Object3D, type InstancedMesh } from "three";
import { scrollStore } from "../scrollStore";
import {
  applyInitialInstances,
  createParticleBuffers,
  stepParticleTransforms,
} from "./confettiMath";

/**
 * Props for ConfettiField instance budget.
 */
export interface ConfettiFieldProps {
  /** Total active instanced confetti particles (500 for full, 180 for lite, 0 for reduced) */
  readonly count: number;
}

/**
 * High-efficiency instanced confetti and bokeh field operating under a single draw call.
 * Uses typed arrays and reusable Object3D transforms to avoid memory allocation inside useFrame.
 *
 * @param props - ConfettiFieldProps
 * @returns JSX.Element | null
 */
export function ConfettiField({ count }: ConfettiFieldProps): JSX.Element | null {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const particles = useMemo(() => createParticleBuffers(count), [count]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh && count > 0) {
      applyInitialInstances(mesh, count, particles, dummy);
    }
  }, [count, dummy, particles]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (mesh && count > 0) {
      const clampedDelta = Math.min(delta, 0.1);
      const scrollOffset = scrollStore.progress * 4.0;
      stepParticleTransforms(mesh, count, particles, dummy, clampedDelta, scrollOffset);
    }
  });

  if (count === 0) {
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
      data-testid="confetti-mesh"
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0.4} depthWrite={false} />
    </instancedMesh>
  );
}
