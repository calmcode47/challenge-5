/**
 * Accessible skip link component conforming to WCAG 2.4.1 (M07-A2).
 * Remains visually hidden until keyboard focus shifts to it, allowing screen reader and
 * keyboard-only users to bypass repetitive navigation landmarks.
 *
 * @returns JSX.Element
 */
export function SkipLink(): JSX.Element {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:rounded-[var(--radius-control)] focus:bg-[var(--color-accent)] focus:text-[var(--color-bg)] focus:font-semibold focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] select-none"
    >
      Skip to main content
    </a>
  );
}
