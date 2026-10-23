import { create } from "zustand";

export interface UiNotification {
  readonly id: string;
  readonly message: string;
  readonly type?: "success" | "info" | "warning";
}

export interface UiState {
  readonly isSearchOpen: boolean;
  readonly notification: UiNotification | null;
  readonly activePlanId: string;
  readonly openSearch: () => void;
  readonly closeSearch: () => void;
  readonly showNotification: (message: string, type?: "success" | "info" | "warning") => void;
  readonly dismissNotification: () => void;
  readonly setActivePlanId: (id: string) => void;
}

/**
 * Global Zustand store managing lightweight UI state across pages.
 */
export const useUiStore = create<UiState>((set) => ({
  isSearchOpen: false,
  notification: null,
  activePlanId: "cl-001",
  openSearch: () => {
    set({ isSearchOpen: true });
  },
  closeSearch: () => {
    set({ isSearchOpen: false });
  },
  showNotification: (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    set({ notification: { id, message, type } });
  },
  dismissNotification: () => {
    set({ notification: null });
  },
  setActivePlanId: (id) => {
    set({ activePlanId: id });
  },
}));
