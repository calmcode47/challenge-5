import { describe, expect, it } from "vitest";
import { addDays, daysBetween, parseIsoDate, toIsoDate } from "./dateMath.js";

describe("dateMath — UTC Midnight Date Math", () => {
  it("parses valid ISO dates into UTC midnight", () => {
    const d = parseIsoDate("2027-06-15");
    expect(d.getUTCFullYear()).toBe(2027);
    expect(d.getUTCMonth()).toBe(5); // 0-indexed June
    expect(d.getUTCDate()).toBe(15);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
  });

  it("rejects malformed ISO date strings", () => {
    expect(() => parseIsoDate("not-a-date")).toThrow("Invalid ISO date format");
    expect(() => parseIsoDate("2027/06/15")).toThrow("Invalid ISO date format");
    expect(() => parseIsoDate("2027-6-15")).toThrow("Invalid ISO date format");
  });

  it("rejects non-existent calendar dates", () => {
    expect(() => parseIsoDate("2027-02-30")).toThrow("Invalid calendar date");
    expect(() => parseIsoDate("2027-04-31")).toThrow("Invalid calendar date");
    expect(() => parseIsoDate("2027-02-29")).toThrow("Invalid calendar date"); // 2027 is not leap
  });

  it("formats Date into ISO YYYY-MM-DD string", () => {
    const d = new Date(Date.UTC(2027, 8, 5));
    expect(toIsoDate(d)).toBe("2027-09-05");
  });

  it("calculates exact daysBetween for strings and Date instances", () => {
    expect(daysBetween("2027-01-01", "2027-01-10")).toBe(9);
    expect(daysBetween("2027-01-10", "2027-01-01")).toBe(-9);
    expect(daysBetween("2027-01-01", "2027-01-01")).toBe(0);

    const d1 = new Date(Date.UTC(2027, 0, 1));
    const d2 = new Date(Date.UTC(2027, 0, 15));
    expect(daysBetween(d1, d2)).toBe(14);
  });

  it("adds and subtracts days accurately", () => {
    expect(addDays("2027-01-01", 10)).toBe("2027-01-11");
    expect(addDays("2027-01-11", -10)).toBe("2027-01-01");
    expect(addDays("2027-01-01", 0)).toBe("2027-01-01");
  });

  it("correctly handles leap day transitions", () => {
    // 2028 is a leap year
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2028-02-29", 1)).toBe("2028-03-01");
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(addDays("2028-03-01", -2)).toBe("2028-02-28");
  });

  it("correctly handles year boundary transitions", () => {
    expect(addDays("2027-12-31", 1)).toBe("2028-01-01");
    expect(addDays("2028-01-01", -1)).toBe("2027-12-31");
    expect(daysBetween("2027-12-31", "2028-01-01")).toBe(1);
  });

  it("produces identical day arithmetic across DST boundaries (March & November)", () => {
    // US DST spring-forward: March 14, 2027 (clocks jump 2am -> 3am)
    // US DST fall-back: November 7, 2027 (clocks fall back 2am -> 1am)
    // Under UTC midnight, exactly 1 day = 24 hours = 86,400,000 ms with zero drift.

    const marchBefore = "2027-03-13";
    const marchAfter = "2027-03-15";
    expect(daysBetween(marchBefore, marchAfter)).toBe(2);
    expect(addDays(marchBefore, 2)).toBe(marchAfter);

    const novBefore = "2027-11-06";
    const novAfter = "2027-11-08";
    expect(daysBetween(novBefore, novAfter)).toBe(2);
    expect(addDays(novBefore, 2)).toBe(novAfter);

    // European DST transitions (last Sunday in March & October)
    expect(daysBetween("2027-03-27", "2027-03-29")).toBe(2);
    expect(daysBetween("2027-10-30", "2027-11-01")).toBe(2);
  });
});
