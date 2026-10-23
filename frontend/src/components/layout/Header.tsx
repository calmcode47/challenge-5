import { Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router";
import { EffectsToggle } from "./EffectsToggle";
import { ShortcutsDialog } from "./ShortcutsDialog";

/**
 * Top header banner navigation containing brand identifier, primary routing links,
 * and persistent accessibility/effects controls.
 *
 * @returns JSX.Element
 */
export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-line-subtle)] bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-control)] p-1"
        >
          <span className="p-1 rounded-[var(--radius-control)] bg-[var(--color-accent)] text-[var(--color-bg)]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display tracking-wider text-2xl uppercase">Occasio</span>
        </Link>

        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/plan/new"
            className={({ isActive }) =>
              `px-3 py-1.5 text-sm font-medium rounded-[var(--radius-control)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                isActive
                  ? "bg-[var(--color-raised)] text-[var(--color-accent)] font-semibold"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`
            }
          >
            New Plan
          </NavLink>
          <NavLink
            to="/plans"
            className={({ isActive }) =>
              `px-3 py-1.5 text-sm font-medium rounded-[var(--radius-control)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                isActive
                  ? "bg-[var(--color-raised)] text-[var(--color-accent)] font-semibold"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`
            }
          >
            Plans
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <EffectsToggle />
          <ShortcutsDialog />
        </div>
      </div>
    </header>
  );
}
