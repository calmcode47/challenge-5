import { Link } from "react-router";

/**
 * Site footer containing copyright, privacy, and user data management navigation links.
 *
 * @returns JSX.Element
 */
export function Footer(): JSX.Element {
  return (
    <footer className="w-full border-t border-[var(--color-line-subtle)] bg-[var(--color-bg)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-muted)]">
        <div>
          <p>© {new Date().getFullYear()} Occasio. Plan the day, not the spreadsheet.</p>
        </div>
        <nav aria-label="Footer Navigation" className="flex items-center gap-6">
          <Link
            to="/privacy"
            className="hover:text-[var(--color-text)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-control)] p-1"
          >
            Privacy Policy
          </Link>
          <Link
            to="/my-data"
            className="hover:text-[var(--color-text)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-control)] p-1"
          >
            My Data & Export
          </Link>
        </nav>
      </div>
    </footer>
  );
}
