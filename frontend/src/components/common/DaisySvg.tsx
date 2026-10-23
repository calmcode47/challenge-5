import type { ReactElement } from "react";

export interface DaisySvgProps {
  readonly className?: string;
  readonly petalColor?: string;
  readonly centerColor?: string;
  readonly size?: number;
}

/**
 * Ceramic botanical daisy ornament SVG component.
 */
export function DaisySvg({
  className = "",
  petalColor = "#FBF7EE",
  centerColor = "#F3CE72",
  size = 24,
}: DaisySvgProps): ReactElement {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g fill={petalColor}>
        <circle cx="50" cy="22" r="14" />
        <circle cx="50" cy="78" r="14" />
        <circle cx="22" cy="50" r="14" />
        <circle cx="78" cy="50" r="14" />
        <circle cx="30" cy="30" r="14" />
        <circle cx="70" cy="70" r="14" />
        <circle cx="30" cy="70" r="14" />
        <circle cx="70" cy="30" r="14" />
      </g>
      <circle cx="50" cy="50" fill={centerColor} r="13" />
    </svg>
  );
}
