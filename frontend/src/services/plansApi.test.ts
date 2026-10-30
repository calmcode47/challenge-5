import { afterEach, describe, expect, it, vi } from "vitest";
import { warmPlannerApi } from "./apiConfig.js";
import { generatePlan } from "./plansApi.js";

const form = {
  vertical: "wedding" as const,
  title: "Maya & Ravi's Wedding",
  notes: "Include a small family ceremony.",
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
    budgetAllocation: [
      { category: "Venue & rentals", amount: 4680, percent: 26 },
      { category: "Food & beverage", amount: 5040, percent: 28 },
    ],
    timeline: [
      {
        phase: "Foundation",
        due: "2026-08-18",
        task: "Confirm venue terms and access route.",
        owner: "Planner",
      },
    ],
    personalizedIdeas: ["Welcome guests with a handwritten note."],
    vendorChecklist: ["Verify liability insurance."],
    riskFlags: ["Keep contingency available."],
    aiMode: "deterministic",
    generatedAt: "2026-10-31T00:00:00.000Z",
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
    const [, requestInit] = fetchMock.mock.calls[0] as [unknown, RequestInit];
    expect(JSON.parse(requestInit.body as string)).toMatchObject({
      notes: form.notes,
    });
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

  it("rejects a malformed or unexpected API payload before it reaches the workspace", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...generated,
          data: { ...generated.data, generatedAt: "not-an-iso-timestamp" },
        }),
        { status: 201 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(generatePlan(form)).rejects.toThrow();
  });
});
