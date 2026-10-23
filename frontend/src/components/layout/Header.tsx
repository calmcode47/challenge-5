import type { ReactElement } from "react";
import { Link, useLocation } from "react-router";
import { MaterialIcon } from "../common/MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";

const NAV_LINKS = [
  { path: "/", label: "Studio Home" },
  { path: "/plan-wizard", label: "Plan Wizard" },
  { path: "/event-workspace", label: "Event Workspace" },
  { path: "/my-plans-vault", label: "My Plans & Vault" },
];

function HeaderBrand(): ReactElement {
  return (
    <Link to="/" className="flex items-center gap-space-sm group">
      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-wine-accent shadow-[0_2px_6px_rgba(92,29,36,0.08)] group-hover:scale-105 transition-transform">
        <MaterialIcon name="local_florist" size={24} />
      </div>
      <div className="flex flex-col">
        <span className="font-title-md text-title-md text-wine-deep tracking-tight font-bold">
          Soft Clay
        </span>
        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
          Celebrations
        </span>
      </div>
    </Link>
  );
}

function HeaderNav(): ReactElement {
  const location = useLocation();

  const isLinkActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/studio-home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="hidden lg:flex items-center gap-space-md bg-sage-soft/60 px-space-md py-space-xs rounded-full shadow-[0_1px_4px_rgba(92,29,36,0.04)]"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(link.path);
        return (
          <Link
            key={link.path}
            to={link.path}
            aria-current={active ? "page" : undefined}
            className={`transition-colors ${
              active
                ? "bg-wine-accent text-cream-linen font-label-lg rounded-full px-space-md py-space-xs shadow-xs"
                : "font-label-lg text-label-lg text-on-surface-variant hover:text-wine-accent px-space-sm py-space-xs"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderActions(): ReactElement {
  const { openSearch } = useUiStore();

  return (
    <div className="flex items-center gap-space-sm">
      <button
        type="button"
        onClick={openSearch}
        className="w-10 h-10 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/30 transition-colors"
        aria-label="Search studio"
      >
        <MaterialIcon name="search" size={20} />
      </button>
      <Link
        to="/plan-wizard"
        className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-butter-sun text-text-primary font-label-lg text-label-lg hover:bg-butter-sun/80 shadow-[0_2px_8px_rgba(122,40,50,0.08)] transition-all hover:scale-105 active:scale-95"
      >
        <MaterialIcon name="celebration" size={18} />
        <span>Plan Celebration</span>
      </Link>
      <div
        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(92,29,36,0.12)] text-on-primary"
        aria-label="User profile"
      >
        <MaterialIcon name="person" size={18} />
      </div>
    </div>
  );
}

/**
 * Top navigation header for Soft Clay Celebrations studio pages.
 */
export function Header(): ReactElement {
  return (
    <header className="fixed top-0 w-full z-50 bg-cream-linen/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(122,40,50,0.06)]">
      <div className="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-md">
        <HeaderBrand />
        <HeaderNav />
        <HeaderActions />
      </div>
    </header>
  );
}
