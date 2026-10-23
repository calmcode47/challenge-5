import { describe, expect, it } from "vitest";
import { EVENT_TYPES } from "../../contracts/enums.js";
import {
  getAllMilestoneTemplates,
  getMilestoneTemplates,
  type MilestoneTemplate,
} from "./templates.js";
import { topologicalSortTemplates } from "./compress.js";

describe("templates — Milestone Template Graph & DAG Validation", () => {
  it("provides templates for all supported event types", () => {
    for (const eventType of EVENT_TYPES) {
      const templates = getMilestoneTemplates(eventType);
      expect(templates.length).toBeGreaterThan(0);
    }
  });

  it("ensures all milestone IDs are unique within each event type", () => {
    for (const eventType of EVENT_TYPES) {
      const templates = getMilestoneTemplates(eventType);
      const ids = new Set<string>();
      for (const t of templates) {
        expect(ids.has(t.id), `Duplicate milestone ID "${t.id}" in ${eventType}`).toBe(false);
        ids.add(t.id);
      }
    }
  });

  it("verifies that all milestone dependency graphs are valid DAGs with no cycles", () => {
    for (const eventType of EVENT_TYPES) {
      const templates = getMilestoneTemplates(eventType);
      // topologicalSortTemplates throws an Error if any cycle or missing dependency is found
      const sorted = topologicalSortTemplates(templates);
      expect(sorted.length).toBe(templates.length);

      // Verify dependency order: dependency index must be strictly less than dependent index
      const indexMap = new Map<string, number>(sorted.map((t, idx) => [t.id, idx]));
      for (const t of templates) {
        for (const depId of t.dependsOn) {
          const depIndex = indexMap.get(depId);
          const tIndex = indexMap.get(t.id);
          expect(depIndex).toBeDefined();
          expect(tIndex).toBeDefined();
          if (depIndex !== undefined && tIndex !== undefined) {
            expect(
              depIndex,
              `In ${eventType}, dependency "${depId}" must precede "${t.id}" in topological sort`
            ).toBeLessThan(tIndex);
          }
        }
      }
    }
  });

  it("detects circular dependencies and throws an error", () => {
    const cyclicTemplates: MilestoneTemplate[] = [
      { id: "A", titleKey: "A", leadDays: 10, dependsOn: ["B"], critical: true },
      { id: "B", titleKey: "B", leadDays: 8, dependsOn: ["C"], critical: true },
      { id: "C", titleKey: "C", leadDays: 6, dependsOn: ["A"], critical: true },
    ];
    expect(() => topologicalSortTemplates(cyclicTemplates)).toThrow("Circular dependency detected");
  });

  it("detects unknown dependencies and throws an error", () => {
    const invalidTemplates: MilestoneTemplate[] = [
      { id: "A", titleKey: "A", leadDays: 10, dependsOn: ["non_existent"], critical: true },
    ];
    expect(() => topologicalSortTemplates(invalidTemplates)).toThrow("Unknown dependency");
  });

  it("returns all milestone templates across all categories", () => {
    const all = getAllMilestoneTemplates();
    expect(all.length).toBeGreaterThan(30);
  });

  it("handles dependent milestones declared before dependencies in input array", () => {
    const unordered: MilestoneTemplate[] = [
      { id: "child", titleKey: "Child", leadDays: 10, dependsOn: ["parent"], critical: true },
      { id: "parent", titleKey: "Parent", leadDays: 20, dependsOn: [], critical: true },
    ];
    const sorted = topologicalSortTemplates(unordered);
    expect(sorted.map((t) => t.id)).toEqual(["parent", "child"]);
  });
});
