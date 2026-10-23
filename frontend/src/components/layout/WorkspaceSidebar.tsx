import type { ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../common/MaterialIcon.js";

/** Props for WorkspaceSidebar. */
export interface WorkspaceSidebarProps {
  readonly activeModule: string;
  readonly onSelectModule: (module: string) => void;
}

interface ModuleItem {
  id: string;
  label: string;
  icon: string;
}

const MODULES: ModuleItem[] = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "timeline", label: "Timeline & Waves", icon: "calendar_today" },
  { id: "budget", label: "Tactile Budget", icon: "payments" },
  { id: "tables", label: "Pottery Tables", icon: "diversity_1" },
];

function SidebarPaletteNotice(): ReactElement {
  return (
    <div className="px-space-md pt-space-md bg-cream-surface/60 mx-space-sm rounded-xl p-space-sm">
      <div className="flex items-center gap-space-xs text-wine-accent mb-space-xs">
        <MaterialIcon name="palette" size={18} />
        <span className="font-label-sm text-label-sm uppercase font-bold">Stoneware Mode</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Autumn Terracotta Palette Active
      </p>
    </div>
  );
}

/**
 * Fixed left sidebar navigation for the Event Planning Workspace.
 */
export function WorkspaceSidebar({
  activeModule,
  onSelectModule,
}: WorkspaceSidebarProps): ReactElement {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-cream-linen z-50 flex flex-col pt-space-lg pb-space-lg shadow-[0_4px_16px_-2px_rgba(122,40,50,0.06)]">
      <Link to="/" className="px-space-lg mb-space-xl flex items-center gap-space-xs group">
        <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-wine-accent group-hover:scale-105 transition-transform">
          <MaterialIcon name="local_florist" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-title-md text-title-md text-wine-deep font-bold">Soft Clay</span>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            Workspace
          </span>
        </div>
      </Link>

      <div className="px-space-md mb-space-sm">
        <span className="font-label-sm text-label-sm text-secondary px-space-sm uppercase tracking-wider font-semibold">
          Planning Modules
        </span>
      </div>

      <nav className="flex-1 px-space-sm flex flex-col gap-space-xs" aria-label="Workspace modules">
        {MODULES.map((m) => {
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelectModule(m.id);
              }}
              className={`flex items-center gap-space-sm px-space-md py-space-xs rounded-xl transition-colors text-left ${
                isActive
                  ? "bg-wine-accent text-cream-linen font-label-lg shadow-[0_2px_6px_rgba(92,29,36,0.1)]"
                  : "font-label-lg text-label-lg text-on-surface-variant hover:bg-sage-soft/70 hover:text-on-surface"
              }`}
            >
              <MaterialIcon name={m.icon} size={20} />
              <span>{m.label}</span>
            </button>
          );
        })}

        <Link
          to="/my-plans-vault"
          className="flex items-center gap-space-sm px-space-md py-space-xs rounded-xl font-label-lg text-label-lg text-on-surface-variant hover:bg-sage-soft/70 hover:text-on-surface transition-colors"
        >
          <MaterialIcon name="archive" size={20} />
          <span>Clay Vault</span>
        </Link>
      </nav>

      <SidebarPaletteNotice />
    </aside>
  );
}
