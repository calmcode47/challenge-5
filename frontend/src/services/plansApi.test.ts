import { afterEach, describe, expect, it, vi } from "vitest";
import { warmPlannerApi } from "./apiConfig.js";
import { generatePlan } from "./plansApi.js";

const form = {
  vertical: "wedding" as const,
  title: "Maya & Ravi's Wedding",
  date: "2027-02-14",
  venue: "Botanical Orchard" as const,
  budgetTotal: 18000,
  guestCount: 90,
  sensoryAda: true,
  sensoryAllergen: true,
  sensoryPavilion: false,
  sensoryAcoustic: false,
};

const generated = {
  data: {
    id: "plan-1",
    title: form.title,
    eventType: "wedding",
    date: form.date,
    guestCount: form.guestCount,
    budget: form.budgetTotal,
    venue: form.venue,
    personalizedIdeas: ["Welcome guests with a handwritten note."],
    vendorChecklist: ["Verify liability insurance."],
    riskFlags: ["Keep contingency available."],
    aiMode: "deterministic",
  },
};

afterEach(() => {
  window.sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe("plans API", () => {
  it("posts a validated wizard brief", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(generated), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(generatePlan(form)).resolves.toMatchObject(generated.data);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/plans/generate",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("warms the backend only once per browser session", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await warmPlannerApi();
    await warmPlannerApi();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/health",
      expect.objectContaining({ credentials: "omit", method: "GET" })
    );
  });
});
