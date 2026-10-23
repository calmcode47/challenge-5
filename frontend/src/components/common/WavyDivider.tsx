import type { ReactElement } from "react";

export interface WavyDividerProps {
  readonly className?: string;
  readonly strokeWidth?: number;
}

/**
 * Organic wavy squiggle line divider representing artisan clay trimming.
 */
export function WavyDivider({
  className = "w-24 h-4 text-wine-accent my-1",
  strokeWidth = 3,
}: WavyDividerProps): ReactElement {
  return (
    <div className={className} aria-hidden="true">
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        viewBox="0 0 100 16"
      >
        <path d="M0,8 Q12.5,0 25,8 T50,8 T75,8 T100,8" />
      </svg>
    </div>
  );
}
