import type { StoredPlan } from "./persistence.js";

/** Demonstration plans used only when the browser vault is empty. */
export const INITIAL_PLANS: readonly StoredPlan[] = [
  {
    id: "cl-001",
    title: "Elena & Marcus Blossom Wedding",
    date: "2027-10-18",
    guestCount: 120,
    completionRatio: 0.68,
    totalBudget: 24000,
    vertical: "wedding",
    archetype: "Wedding Atelier",
    venue: "Stone Creek Orchard",
    sensoryCount: 4,
    tags: ["Hand-Formed", "Live Music"],
    description:
      "Terracotta & wild cosmos palette, open-air pergola banquet, handmade glazed place markers.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyQm7_G55zHQNWVY0HD7s_4GnGOI7WC1mZMfZgPXlAxTqq7aHhOri22Vi6_3lutsJLMvCwQHgpQjOG_ic4u2lZlDh7oHh1DTz5gZbVL50ba1g6EPhcdsoiBVj8xJMPSE6xZEF1ZE2OTClJ4cFSPAVz1Ir_8Lx06AstTnni4bp_eDGnpoGRX4vTb--FHSfmkare-Kt4M_T3FxYur7Ka9ufkWMnzo1AAcIGfdExu2iE4wUsuZtjbavXN2Q",
    updatedAt: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "cl-002",
    title: "Grandma Rosa's 80th Jubilee",
    date: "2027-07-12",
    guestCount: 45,
    completionRatio: 0.92,
    totalBudget: 4200,
    vertical: "milestone",
    archetype: "Milestone Birthday",
    venue: "Ceramic Loft Studio",
    sensoryCount: 3,
    tags: ["Family Heirloom", "Intimate"],
    description:
      "Garden pavilion gathering with ancestral family recipe tastings and custom ceramic memory plates.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDr8SSNYXXjECraEJUpEz8mzEDDWi-Ks4SHVVX2tv57dE2Cur7uoelTZGu5cHt3mqG5e6zeww5rHN-k5UJPAeEZH-Aec49KmihuzdJl3TBzABeE2nweIJLhyPROnStNhXWLmRaT3vy6-flLKQRh3Y30rjeWlnYS6X9g8i-JIs_50OI-7j_kBoF52rVmEq8zROwcfgoHrpWfYtcekhivMgcYxW_5A586yB0hr1uM5KByf1PSL4xrnigxRg",
    updatedAt: "2026-07-12T10:00:00.000Z",
  },
  {
    id: "cl-003",
    title: "Oakridge Summer Artisan Fair",
    date: "2027-08-30",
    guestCount: 350,
    completionRatio: 0.35,
    totalBudget: 7800,
    vertical: "community",
    archetype: "Communal Fair",
    venue: "Wildflower Meadow",
    sensoryCount: 2,
    tags: ["Live Wheel", "Multi-vendor"],
    description:
      "Outdoor craft demonstration booths, slip-cast workshops, acoustic stage, and artisanal bakeries.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABaU318T4mpUuBTIIM39SQ-4Pbd0ATYQY94k6p-3ePhoOVgotAiYrOeZo1PmRbyS4-0y5FR97sr7Bx4Rm3AWneZ9a2_jng0l2qZxuYj7piFPQze6xRcifuBUZREp783IIz-1vreKFMSAoJ_Un6n0L1igOtZv1Y7cWvWu0QxE27F-QMx-YALhpiyQQqpGMJlxRd9HUbA9RXMEBnMU5nFdC2siNFSm0mBH4oCm7RJOcG8deuTArTGxTQaA",
    updatedAt: "2026-08-30T10:00:00.000Z",
  },
];
