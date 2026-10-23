/**
 * Accessible live region roles.
 */
export type LiveRegionRole = "status" | "alert" | "log";

/**
 * Props for the LiveRegion component.
 */
export interface LiveRegionProps {
  /** Announceable text message */
  readonly message: string;
  /** WAI-ARIA role defining polite vs assertive notification priority */
  readonly role?: LiveRegionRole;
  /** aria-live politeness setting */
  readonly ariaLive?: "polite" | "assertive" | "off";
  /** Whether the region is visually hidden (screen readers only) */
  readonly visuallyHidden?: boolean;
  /** Optional extra classes */
  readonly className?: string;
}

/**
 * Accessible live region informing assistive technology of asynchronous dynamic updates.
 *
 * @param props - LiveRegionProps
 * @returns JSX.Element
 */
export function LiveRegion({
  message,
  role = "status",
  ariaLive = "polite",
  visuallyHidden = true,
  className = "",
}: LiveRegionProps): JSX.Element {
  const hiddenClass = visuallyHidden
    ? "sr-only"
    : "p-3 rounded-[var(--radius-control)] bg-[var(--color-raised)] text-sm text-[var(--color-text)]";

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={`${hiddenClass} ${className}`}
    >
      {message}
    </div>
  );
}
