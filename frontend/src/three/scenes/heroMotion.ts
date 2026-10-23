import type { RefObject } from "react";
import type { Group, InstancedMesh, Mesh, Object3D } from "three";
import { scrollStore } from "../scrollStore";

/**
 * Total orbiting celebration beads circling the central sculpture.
 */
export const ORBIT_BOX_COUNT = 24;

/**
 * Refs for sculpture component parts.
 */
export interface SculptureRefs {
  readonly coreRef: RefObject<Mesh | null>;
  readonly ring1Ref: RefObject<Mesh | null>;
  readonly ring2Ref: RefObject<Mesh | null>;
  readonly orbitRef: RefObject<InstancedMesh | null>;
}

function updateSculptureRotations(refs: SculptureRefs, delta: number): void {
  const core = refs.coreRef.current;
  if (core?.rotation) {
    core.rotation.x += delta * 0.25;
    core.rotation.y += delta * 0.35;
  }
  const ring1 = refs.ring1Ref.current;
  if (ring1?.rotation) {
    ring1.rotation.z += delta * 0.45;
  }
  const ring2 = refs.ring2Ref.current;
  if (ring2?.rotation) {
    ring2.rotation.y -= delta * 0.35;
  }
}

function updateOrbitBeads(orbit: InstancedMesh | null, dummy: Object3D, elapsedTime: number): void {
  if (!orbit || typeof orbit.setMatrixAt !== "function") {
    return;
  }
  const time = elapsedTime * 0.6;
  for (let i = 0; i < ORBIT_BOX_COUNT; i += 1) {
    const angle = (i / ORBIT_BOX_COUNT) * Math.PI * 2 + time;
    const radius = 2.6 + Math.sin(time + i) * 0.2;
    dummy.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 2) * 0.4,
      Math.sin(angle) * radius
    );
    dummy.rotation.set(angle, angle * 1.5, 0);
    dummy.updateMatrix();
    orbit.setMatrixAt(i, dummy.matrix);
  }
  orbit.instanceMatrix.needsUpdate = true;
}

/**
 * Advances geometric celebration sculpture motion, incorporating pointer tracking,
 * scroll fadeout, and continuous gyro rotations without allocating memory.
 *
 * @param group - Root celebration sculpture group
 * @param refs - Component mesh references
 * @param dummy - Scratch Object3D for orbit bead matrix math
 * @param delta - Clock time delta in seconds
 * @param elapsedTime - Total elapsed clock time in seconds
 */
export function updateHeroMotion(
  group: Group | null | undefined,
  refs: SculptureRefs,
  dummy: Object3D,
  delta: number,
  elapsedTime: number
): void {
  if (!group || typeof group.position.set !== "function") {
    return;
  }
  const scroll = scrollStore.progress;
  if (scroll > 0.38) {
    group.visible = false;
    return;
  }
  group.visible = true;

  const scrollT = Math.min(1, scroll / 0.35);
  group.scale.setScalar(Math.max(0.001, (1 - scrollT * scrollT) * 1.0));
  group.position.set(scrollT * 2.5, scrollT * 1.2, -scrollT * 2.0);

  group.rotation.x += (scrollStore.pointerY * 0.15 - group.rotation.x) * 0.08;
  group.rotation.y += (scrollStore.pointerX * 0.15 - group.rotation.y) * 0.08;

  updateSculptureRotations(refs, delta);
  updateOrbitBeads(refs.orbitRef.current, dummy, elapsedTime);
}
