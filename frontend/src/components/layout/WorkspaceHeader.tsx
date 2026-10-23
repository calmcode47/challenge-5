import type { ReactElement } from "react";
import { MaterialIcon } from "../common/MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";

export interface WorkspaceHeaderProps {
  readonly planTitle: string;
}

/**
 * Top fixed sub-header for the Event Planning Workspace.
 */
export function WorkspaceHeader({ planTitle }: WorkspaceHeaderProps): ReactElement {
  const { openSearch, showNotification } = useUiStore();

  const handleNotificationsClick = (): void => {
    showNotification("3 vendor certifications verified and up to date.", "info");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-cream-linen/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(122,40,50,0.04)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-xs">
        <span className="font-label-sm text-label-sm text-secondary bg-sage-soft px-space-sm py-space-xs rounded-full">
          Studio Project: {planTitle}
        </span>
      </div>
      <div className="flex items-center gap-space-md">
        <button
          type="button"
          onClick={openSearch}
          className="w-9 h-9 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/30 transition-colors"
          aria-label="Search project"
        >
          <MaterialIcon name="search" size={18} />
        </button>
        <button
          type="button"
          onClick={handleNotificationsClick}
          className="w-9 h-9 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/30 transition-colors"
          aria-label="View notifications"
        >
          <MaterialIcon name="notifications" size={18} />
        </button>
        <div
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(92,29,36,0.12)] text-on-primary"
          aria-label="Studio Director"
        >
          <MaterialIcon name="person" size={18} />
        </div>
      </div>
    </header>
  );
}
