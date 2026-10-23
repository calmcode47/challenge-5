import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, Vector2, type ShaderMaterial } from "three";
import { paletteFor } from "../palette";
import { scrollStore } from "../scrollStore";
import { auroraFragmentShader, auroraVertexShader } from "../shaders/aurora";

/**
 * Fullscreen procedural GLSL aurora background quad reacting to scroll progression
 * and time delta without React state churn.
 *
 * @returns JSX.Element
 */
export function AuroraBackdrop(): JSX.Element {
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uRes: { value: new Vector2(1920, 1080) },
      uA: { value: new Color("#F2C879") },
      uB: { value: new Color("#9A8CFF") },
      uC: { value: new Color("#5EEAD4") },
    }),
    []
  );

  const targetA = useMemo(() => new Color(), []);
  const targetB = useMemo(() => new Color(), []);
  const targetC = useMemo(() => new Color(), []);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uScroll.value = scrollStore.progress;
    uniforms.uRes.value.set(state.size.width, state.size.height);

    const colors = paletteFor("neutral", scrollStore.section);
    targetA.set(colors[0]);
    targetB.set(colors[1]);
    targetC.set(colors[2]);

    uniforms.uA.value.lerp(targetA, 0.05);
    uniforms.uB.value.lerp(targetB, 0.05);
    uniforms.uC.value.lerp(targetC, 0.05);
  });

  useEffect(() => {
    const mat = materialRef.current;
    return () => {
      if (mat && typeof mat.dispose === "function") {
        mat.dispose();
      }
    };
  }, []);

  return (
    <mesh renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
