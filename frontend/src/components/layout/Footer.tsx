import type { ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../common/MaterialIcon.js";

const CELEBRATION_LINKS = [
  { label: "Weddings & Elopements", to: "/plan-wizard" },
  { label: "Milestone Birthdays", to: "/plan-wizard" },
  { label: "Ceramic Studio Dinners", to: "/plan-wizard" },
  { label: "Intimate Garden Soirees", to: "/plan-wizard" },
] as const;

const TOOL_LINKS = [
  { label: "Ceramic Moodboard Maker", to: "/event-workspace" },
  { label: "Step-by-Step Wizard", to: "/plan-wizard" },
  { label: "Tactile Budget Ledger", to: "/event-workspace" },
  { label: "Guest Seating Pottery Wheel", to: "/event-workspace" },
] as const;

const ATELIER_LINKS = [
  { label: "Our Clay Manifesto", to: "/my-plans-vault" },
  { label: "Studio Notes & Journal", to: "/my-plans-vault" },
  { label: "Privacy & Sovereign Data", to: "/my-plans-vault" },
  { label: "Terms of the Atelier", to: "/my-plans-vault" },
] as const;

function FooterAboutColumn(): ReactElement {
  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex items-center gap-space-xs">
        <MaterialIcon name="local_florist" size={24} className="text-wine-accent" />
        <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
          Soft Clay
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Handcrafted event planning grounded in tactile warmth, pottery elegance, and stress-free
        celebration art.
      </p>
      <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
        <MaterialIcon name="eco" size={16} />
        <span>100% Handcrafted Planning Rituals</span>
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; to: string }[];
}): ReactElement {
  return (
    <div className="flex flex-col gap-space-xs">
      <span className="font-label-lg text-label-lg text-wine-deep uppercase tracking-wider">
        {title}
      </span>
      {links.map((l) => (
        <Link
          key={l.label}
          to={l.to}
          className="font-body-sm text-body-sm text-on-surface-variant hover:text-wine-accent transition-colors"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function FooterLinksColumns(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl">
      <FooterAboutColumn />
      <FooterColumn title="Celebrations" links={CELEBRATION_LINKS} />
      <FooterColumn title="Studio Tools" links={TOOL_LINKS} />
      <FooterColumn title="Atelier & Care" links={ATELIER_LINKS} />
    </div>
  );
}

function FooterBottomBanner(): ReactElement {
  return (
    <div className="mt-space-xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md bg-sage-soft/40 p-space-md rounded-xl">
      <span className="font-body-sm text-body-sm text-secondary">
        &copy; 2025 Soft Clay Celebrations. Molded with care.
      </span>
      <div className="flex items-center gap-space-md">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Natural stoneware inspiration
        </span>
        <div className="w-2 h-2 rounded-full bg-wine-accent" />
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Gentle pacing enabled
        </span>
      </div>
    </div>
  );
}

/**
 * Ceramic footer with radial scallop trim and 4-column studio link matrix.
 */
export function Footer(): ReactElement {
  return (
    <footer className="w-full bg-cream-surface text-on-surface-variant mt-space-2xl">
      <div
        className="h-4 w-full -mt-4 rotate-180 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle at 10px 0, transparent 10px, #F4EEDA 11px)",
          backgroundSize: "20px 16px",
        }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-gutter py-space-2xl">
        <FooterLinksColumns />
        <FooterBottomBanner />
      </div>
    </footer>
  );
}
