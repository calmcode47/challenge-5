import { Color, DynamicDrawUsage, type InstancedMesh, type Object3D } from "three";
import { paletteFor } from "../palette";

/**
 * Pre-allocated typed arrays managing confetti simulation state.
 */
export interface ParticleBuffers {
  readonly pos: Float32Array;
  readonly vel: Float32Array;
  readonly rot: Float32Array;
  readonly rotSpeed: Float32Array;
  readonly scales: Float32Array;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Creates pre-allocated typed arrays populated with deterministic PRNG values.
 *
 * @param count - Number of particle instances
 * @returns ParticleBuffers object
 */
export function createParticleBuffers(count: number): ParticleBuffers {
  const rand = seededRandom(42);
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const rot = new Float32Array(count * 3);
  const rotSpeed = new Float32Array(count * 3);
  const scales = new Float32Array(count * 2);

  for (let i = 0; i < count; i += 1) {
    const idx3 = i * 3;
    const idx2 = i * 2;
    pos[idx3] = (rand() - 0.5) * 24;
    pos[idx3 + 1] = (rand() - 0.5) * 20;
    pos[idx3 + 2] = (rand() - 0.5) * 12 - 2;

    vel[idx3] = (rand() - 0.5) * 0.3;
    vel[idx3 + 1] = -0.3 - rand() * 0.7;
    vel[idx3 + 2] = (rand() - 0.5) * 0.2;

    rot[idx3] = rand() * Math.PI * 2;
    rot[idx3 + 1] = rand() * Math.PI * 2;
    rot[idx3 + 2] = rand() * Math.PI * 2;

    rotSpeed[idx3] = (rand() - 0.5) * 1.5;
    rotSpeed[idx3 + 1] = (rand() - 0.5) * 1.5;
    rotSpeed[idx3 + 2] = (rand() - 0.5) * 1.5;

    scales[idx2] = 0.08 + rand() * 0.16;
    scales[idx2 + 1] = 0.08 + rand() * 0.16;
  }

  return { pos, vel, rot, rotSpeed, scales };
}

function val(arr: Float32Array, idx: number, fallback = 0): number {
  return arr[idx] ?? fallback;
}

/**
 * Initializes instance matrices and theme colors on the target InstancedMesh.
 *
 * @param mesh - Target Three.js InstancedMesh
 * @param count - Total instances
 * @param particles - Particle buffer state
 * @param dummy - Scratch Object3D for matrix calculations
 */
export function applyInitialInstances(
  mesh: InstancedMesh | null | undefined,
  count: number,
  particles: ParticleBuffers,
  dummy: Object3D
): void {
  if (!mesh || typeof mesh.setMatrixAt !== "function") {
    return;
  }
  const palette = paletteFor("neutral");
  const fallbackColor = new Color(palette[0]);
  const colors = [fallbackColor, new Color(palette[1]), new Color(palette[2])];

  mesh.instanceMatrix.setUsage(DynamicDrawUsage);

  for (let i = 0; i < count; i += 1) {
    const idx3 = i * 3;
    const idx2 = i * 2;
    dummy.position.set(
      val(particles.pos, idx3),
      val(particles.pos, idx3 + 1),
      val(particles.pos, idx3 + 2)
    );
    dummy.rotation.set(
      val(particles.rot, idx3),
      val(particles.rot, idx3 + 1),
      val(particles.rot, idx3 + 2)
    );
    dummy.scale.set(val(particles.scales, idx2, 0.15), val(particles.scales, idx2 + 1, 0.15), 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    const color = colors[i % colors.length] ?? fallbackColor;
    mesh.setColorAt(i, color);
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
}

/**
 * Steps single particle physics and updates transform matrix.
 *
 * @param idx3 - 3D buffer index (i * 3)
 * @param idx2 - 2D buffer index (i * 2)
 * @param particles - Particle buffers
 * @param dummy - Scratch Object3D
 * @param delta - Clock time delta in seconds
 * @param scrollOffset - Parallax scroll offset
 */
export function stepSingleParticle(
  idx3: number,
  idx2: number,
  particles: ParticleBuffers,
  dummy: Object3D,
  delta: number,
  scrollOffset: number
): void {
  const px = val(particles.pos, idx3) + val(particles.vel, idx3) * delta;
  let py = val(particles.pos, idx3 + 1) + val(particles.vel, idx3 + 1) * delta;
  const pz = val(particles.pos, idx3 + 2) + val(particles.vel, idx3 + 2) * delta;

  if (py < -12) {
    py = 12;
  }
  particles.pos[idx3] = px;
  particles.pos[idx3 + 1] = py;
  particles.pos[idx3 + 2] = pz;

  const rx = val(particles.rot, idx3) + val(particles.rotSpeed, idx3) * delta;
  const ry = val(particles.rot, idx3 + 1) + val(particles.rotSpeed, idx3 + 1) * delta;
  const rz = val(particles.rot, idx3 + 2) + val(particles.rotSpeed, idx3 + 2) * delta;

  particles.rot[idx3] = rx;
  particles.rot[idx3 + 1] = ry;
  particles.rot[idx3 + 2] = rz;

  dummy.position.set(px, py + scrollOffset * (pz * 0.1), pz);
  dummy.rotation.set(rx, ry, rz);
  dummy.scale.set(val(particles.scales, idx2, 0.15), val(particles.scales, idx2 + 1, 0.15), 1);
  dummy.updateMatrix();
}

/**
 * Batches particle transform calculations across all instances without allocations.
 *
 * @param mesh - InstancedMesh reference
 * @param count - Active count
 * @param particles - Buffer arrays
 * @param dummy - Reusable Object3D
 * @param delta - Clamped time delta
 * @param scrollOffset - Vertical parallax offset
 */
export function stepParticleTransforms(
  mesh: InstancedMesh | null | undefined,
  count: number,
  particles: ParticleBuffers,
  dummy: Object3D,
  delta: number,
  scrollOffset: number
): void {
  if (!mesh || typeof mesh.setMatrixAt !== "function") {
    return;
  }
  for (let i = 0; i < count; i += 1) {
    stepSingleParticle(i * 3, i * 2, particles, dummy, delta, scrollOffset);
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
