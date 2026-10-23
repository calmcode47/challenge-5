import { useMemo } from "react";
import { useEffects } from "./EffectsProvider";
import { AuroraBackdrop } from "./scenes/AuroraBackdrop";
import { ConfettiField } from "./scenes/ConfettiField";
import { HeroObject } from "./scenes/HeroObject";

/**
 * Root composition scene orchestrating the procedural aurora backdrop,
 * instanced confetti field, and landing hero sculpture within a single WebGL scene.
 *
 * @returns JSX.Element
 */
export function SceneRoot(): JSX.Element {
  const { quality } = useEffects();

  const particleCount = useMemo(() => {
    if (quality === "static" || quality === "reduced") {
      return 0;
    }
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return 180;
    }
    return 500;
  }, [quality]);

  return (
    <>
      <AuroraBackdrop />
      <ConfettiField count={particleCount} />
      {quality === "full" && <HeroObject />}
    </>
  );
}
