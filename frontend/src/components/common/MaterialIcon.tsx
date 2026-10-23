import type { ReactElement } from "react";

/** Props for MaterialIcon. */
export interface MaterialIconProps {
  readonly name: string;
  readonly className?: string;
  readonly size?: number;
  readonly filled?: boolean;
}

/**
 * Standardized Google Material Symbol icon component.
 */
export function MaterialIcon({
  name,
  className = "",
  size = 20,
  filled = false,
}: MaterialIconProps): ReactElement {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: `${String(size)}px`,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
