import type { ReactElement } from "react";

export interface ScallopMaskProps {
  readonly className?: string;
  readonly color?: string;
}

/**
 * Scalloped bottom edge cutout SVG ribbon used between pottery hero sections.
 */
export function ScallopMask({
  className = "w-full h-8 -mt-1 bg-surface relative z-20 flex overflow-hidden select-none pointer-events-none",
  color = "currentColor",
}: ScallopMaskProps): ReactElement {
  return (
    <div className={className} aria-hidden="true">
      <svg
        className="w-full h-8 text-wine-accent"
        fill={color}
        preserveAspectRatio="none"
        viewBox="0 0 1200 32"
      >
        <path
          d="M0,0 
             C30,32 70,32 100,0 C130,32 170,32 200,0 C230,32 270,32 300,0 
             C330,32 370,32 400,0 C430,32 470,32 500,0 C530,32 570,32 600,0 
             C630,32 670,32 700,0 C730,32 770,32 800,0 C830,32 870,32 900,0 
             C930,32 970,32 1000,0 C1030,32 1070,32 1100,0 C1130,32 1170,32 1200,0 
             L1200,0 L0,0 Z"
        />
      </svg>
    </div>
  );
}
