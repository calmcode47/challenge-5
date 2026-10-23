import { describe, it, expect, beforeEach } from "vitest";
import { useUiStore } from "./uiStore.js";

describe("uiStore", () => {
  beforeEach(() => {
    useUiStore.setState({
      isSearchOpen: false,
      notification: null,
      activePlanId: undefined,
    });
  });

  it("opens and closes search dialog", () => {
    expect(useUiStore.getState().isSearchOpen).toBe(false);
    useUiStore.getState().openSearch();
    expect(useUiStore.getState().isSearchOpen).toBe(true);
    useUiStore.getState().closeSearch();
    expect(useUiStore.getState().isSearchOpen).toBe(false);
  });

  it("shows and dismisses notifications", () => {
    expect(useUiStore.getState().notification).toBeNull();
    useUiStore.getState().showNotification("Event Saved!", "success");
    const notif = useUiStore.getState().notification;
    expect(notif?.message).toBe("Event Saved!");
    expect(notif?.type).toBe("success");

    useUiStore.getState().dismissNotification();
    expect(useUiStore.getState().notification).toBeNull();
  });

  it("sets active plan ID", () => {
    expect(useUiStore.getState().activePlanId).toBeUndefined();
    useUiStore.getState().setActivePlanId("plan-999");
    expect(useUiStore.getState().activePlanId).toBe("plan-999");
  });
});
