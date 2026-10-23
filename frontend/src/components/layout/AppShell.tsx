import { Outlet } from "react-router";
import { useDoubleEscape } from "../../hooks/useDoubleEscape";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

/**
 * Primary layout shell establishing landmark hierarchy (WCAG 2.4.1), skip links,
 * global double-escape handling, and nested route outlets.
 *
 * @returns JSX.Element
 */
export function AppShell(): JSX.Element {
  useDoubleEscape({
    onDoubleEscape: () => {
      // Focus shift to main is automatically performed by useDoubleEscape
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <SkipLink />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
