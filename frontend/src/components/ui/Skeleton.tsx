/**
 * Shape types for the Skeleton loader.
 */
export type SkeletonShape = "rectangle" | "circle";

/**
 * Props for the Skeleton component.
 */
export interface SkeletonProps {
  /** Optional custom width */
  readonly width?: string | number;
  /** Optional custom height */
  readonly height?: string | number;
  /** Geometric shape */
  readonly shape?: SkeletonShape;
  /** Optional extra classes */
  readonly className?: string;
}

/**
 * Animated content loading placeholder with aria-busy for screen reader awareness.
 *
 * @param props - SkeletonProps
 * @returns JSX.Element
 */
export function Skeleton({
  width,
  height,
  shape = "rectangle",
  className = "",
}: SkeletonProps): JSX.Element {
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-[var(--radius-control)]";

  return (
    <div
      aria-busy="true"
      aria-hidden="true"
      style={{ width, height }}
      className={`animate-pulse bg-[var(--color-raised)]/70 ${shapeClass} ${className}`}
    />
  );
}
