import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import {
  BoxGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
} from "three";
import { describe, expect, it } from "vitest";
import { scrollStore } from "../scrollStore";
import { AuroraBackdrop } from "../scenes/AuroraBackdrop";
import { ConfettiField } from "../scenes/ConfettiField";
import {
  applyInitialInstances,
  createParticleBuffers,
  stepParticleTransforms,
  stepSingleParticle,
} from "../scenes/confettiMath";
import { ORBIT_BOX_COUNT, updateHeroMotion, type SculptureRefs } from "../scenes/heroMotion";
import { HeroLighting, HeroObject, HeroSculpture } from "../scenes/HeroObject";

describe("3D scenes and procedural math (M07-T7)", () => {
  describe("confettiMath", () => {
    it("creates deterministic particle buffers with expected array dimensions", () => {
      const buffers = createParticleBuffers(10);
      expect(buffers.pos.length).toBe(30);
      expect(buffers.vel.length).toBe(30);
      expect(buffers.rot.length).toBe(30);
      expect(buffers.rotSpeed.length).toBe(30);
      expect(buffers.scales.length).toBe(20);
    });

    it("applies initial transforms and palette colors to InstancedMesh", () => {
      const count = 5;
      const mesh = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial(), count);
      const buffers = createParticleBuffers(count);
      const dummy = new Object3D();

      applyInitialInstances(mesh, count, buffers, dummy);
      expect(mesh.instanceMatrix.version).toBeGreaterThan(0);
      expect(mesh.instanceColor).not.toBeNull();
    });

    it("steps single particle physics and wraps vertical boundary", () => {
      const buffers = createParticleBuffers(1);
      const dummy = new Object3D();
      buffers.pos[1] = -15; // Below floor threshold
      buffers.vel[1] = -1;

      stepSingleParticle(0, 0, buffers, dummy, 0.016, 0);
      expect(buffers.pos[1]).toBe(12); // Wrapped to ceiling
    });

    it("steps particle transforms across all active instances", () => {
      const count = 4;
      const mesh = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial(), count);
      const buffers = createParticleBuffers(count);
      const dummy = new Object3D();

      stepParticleTransforms(mesh, count, buffers, dummy, 0.016, 0.5);
      expect(mesh.instanceMatrix.version).toBeGreaterThan(0);

      // Verify safe early exit for invalid mesh
      expect(() => {
        stepParticleTransforms(null, count, buffers, dummy, 0.016, 0);
      }).not.toThrow();
    });
  });

  describe("heroMotion", () => {
    it("safely exits if group is undefined or invalid", () => {
      const refs: SculptureRefs = {
        coreRef: { current: null },
        ring1Ref: { current: null },
        ring2Ref: { current: null },
        orbitRef: { current: null },
      };
      const dummy = new Object3D();
      expect(() => {
        updateHeroMotion(null, refs, dummy, 0.016, 1.0);
      }).not.toThrow();
    });

    it("hides hero sculpture when scroll progress exceeds 0.38", () => {
      scrollStore.progress = 0.5;
      const group = new Group();
      const refs: SculptureRefs = {
        coreRef: { current: null },
        ring1Ref: { current: null },
        ring2Ref: { current: null },
        orbitRef: { current: null },
      };
      const dummy = new Object3D();

      updateHeroMotion(group, refs, dummy, 0.016, 1.0);
      expect(group.visible).toBe(false);
    });

    it("animates hero sculpture, rings, and 24 orbit beads within landing view", () => {
      scrollStore.progress = 0.1;
      scrollStore.pointerX = 0.5;
      scrollStore.pointerY = -0.3;

      const group = new Group();
      const core = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
      const ring1 = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
      const ring2 = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
      const orbit = new InstancedMesh(
        new BoxGeometry(0.1, 0.1, 0.1),
        new MeshBasicMaterial(),
        ORBIT_BOX_COUNT
      );

      const refs: SculptureRefs = {
        coreRef: { current: core },
        ring1Ref: { current: ring1 },
        ring2Ref: { current: ring2 },
        orbitRef: { current: orbit },
      };
      const dummy = new Object3D();

      updateHeroMotion(group, refs, dummy, 0.016, 2.0);

      expect(group.visible).toBe(true);
      expect(core.rotation.x).toBeGreaterThan(0);
      expect(ring1.rotation.z).toBeGreaterThan(0);
      expect(ring2.rotation.y).toBeLessThan(0);
      expect(orbit.instanceMatrix.version).toBeGreaterThan(0);
    });
  });

  describe("Scene React components", () => {
    it("renders ConfettiField when count > 0 and returns null when count is 0", () => {
      const { rerender } = render(<ConfettiField count={10} />);
      expect(screen.getByTestId("confetti-mesh")).toBeInTheDocument();

      rerender(<ConfettiField count={0} />);
      expect(screen.queryByTestId("confetti-mesh")).not.toBeInTheDocument();
    });

    it("renders HeroLighting and HeroSculpture subcomponents", () => {
      render(
        <div>
          <HeroLighting />
          <HeroSculpture
            coreRef={{ current: null }}
            ring1Ref={{ current: null }}
            ring2Ref={{ current: null }}
            orbitRef={{ current: null }}
          />
        </div>
      );
      expect(screen.getByTestId("hero-core")).toBeInTheDocument();
      expect(screen.getByTestId("hero-ring1")).toBeInTheDocument();
      expect(screen.getByTestId("hero-ring2")).toBeInTheDocument();
      expect(screen.getByTestId("hero-orbit")).toBeInTheDocument();
    });

    it("renders HeroObject on landing route ('/') and returns null on other routes", () => {
      const { unmount } = render(
        <MemoryRouter initialEntries={["/"]}>
          <HeroObject />
        </MemoryRouter>
      );
      expect(screen.getByTestId("hero-group")).toBeInTheDocument();
      unmount();

      render(
        <MemoryRouter initialEntries={["/plans"]}>
          <HeroObject />
        </MemoryRouter>
      );
      expect(screen.queryByTestId("hero-group")).not.toBeInTheDocument();
    });

    it("renders AuroraBackdrop quad and handles unmount cleanup", () => {
      const { unmount } = render(<AuroraBackdrop />);
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
});
