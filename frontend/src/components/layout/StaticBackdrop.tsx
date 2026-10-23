/**
 * Static CSS background layer providing instant paint (no blank flash) and permanent
 * visual foundation when 3D WebGL rendering is disabled, unsupported, or degraded.
 *
 * @returns JSX.Element
 */
export function StaticBackdrop(): JSX.Element {
  return (
    <div
      className="fixed inset-0 -z-20 pointer-events-none bg-static"
      aria-hidden="true"
      role="presentation"
      data-testid="static-backdrop"
    />
  );
}
