import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { useReducedMotionPref } from "../../../hooks/useReducedMotionPref";

/**
 * Props for the TiltCard component.
 */
export interface TiltCardProps {
  /** Target link destination */
  readonly to: string;
  /** Primary card title */
  readonly title: string;
  /** Event subtitle or tagline */
  readonly tagline: string;
  /** Bullet points of what is included */
  readonly whatYouGet: readonly string[];
  /** Accent border or badge color */
  readonly accentColor: string;
  /** Badge text */
  readonly badgeText: string;
  /** Accessible icon node */
  readonly icon?: ReactNode;
}

function useTilt(canTilt: boolean) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [transformStyle, setTransformStyle] = useState("");

  const handlePointerMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!canTilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -7;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 7;
      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
      );
    },
    [canTilt]
  );

  const handlePointerLeave = useCallback(() => {
    if (!canTilt) return;
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }, [canTilt]);

  return { cardRef, transformStyle, handlePointerMove, handlePointerLeave };
}

function TiltCardBody({
  title,
  tagline,
  whatYouGet,
  accentColor,
  badgeText,
  icon,
}: Omit<TiltCardProps, "to">): JSX.Element {
  return (
    <>
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-[var(--radius-pill)] border"
            style={{
              borderColor: `${accentColor}40`,
              color: accentColor,
              backgroundColor: "var(--color-raised)",
            }}
          >
            {icon}
            {badgeText}
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] group-hover:text-[var(--color-text)] transition-colors">
            Start Wizard →
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-wide text-[var(--color-text)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">{tagline}</p>

        <div className="border-t border-[var(--color-line-subtle)] pt-4">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-text)] mb-3">
            What you get:
          </p>
          <ul className="space-y-2">
            {whatYouGet.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs sm:text-sm text-[var(--color-muted)]"
              >
                <span className="text-[var(--color-accent)] mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[var(--color-line-subtle)] flex items-center justify-between text-xs font-medium text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
        <span>Plan with {title} heuristics</span>
        <span aria-hidden="true">→</span>
      </div>
    </>
  );
}

/**
 * Interactive card with CSS 3D perspective tilt reacting to fine pointer coordinates.
 * Automatically gracefully degrades to standard card on touch devices or under reduced motion.
 *
 * @param props - TiltCardProps
 * @returns JSX.Element
 */
export function TiltCard({
  to,
  title,
  tagline,
  whatYouGet,
  accentColor,
  badgeText,
  icon,
}: TiltCardProps): JSX.Element {
  const prefersReduced = useReducedMotionPref();
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) {
      setCanTilt(false);
      return;
    }
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    setCanTilt(finePointer);
  }, [prefersReduced]);

  const { cardRef, transformStyle, handlePointerMove, handlePointerLeave } = useTilt(canTilt);

  return (
    <Link
      ref={cardRef}
      to={to}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={{
        transform: transformStyle,
        transition: transformStyle ? "transform 150ms ease-out" : "transform 350ms ease",
      }}
      className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-[var(--radius-card)] bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-line-subtle)] hover:border-[var(--color-line)] shadow-lg focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] outline-none min-h-[360px]"
    >
      <TiltCardBody
        title={title}
        tagline={tagline}
        whatYouGet={whatYouGet}
        accentColor={accentColor}
        badgeText={badgeText}
        icon={icon}
      />
    </Link>
  );
}
