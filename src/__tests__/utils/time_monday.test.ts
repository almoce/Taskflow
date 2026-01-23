import { describe, expect, it } from "vitest";
import { getStartOfMondayWeek, getWeekRangeLabel } from "@/utils/time";

describe("Monday Week Utilities", () => {
  describe("getStartOfMondayWeek", () => {
    it("should return the Monday of the current week", () => {
      // Mock date: Wednesday, Jan 22, 2026
      const date = new Date("2026-01-22T12:00:00Z");
      const monday = getStartOfMondayWeek(date, 0);

      expect(monday.toISOString()).toContain("2026-01-19"); // Monday Jan 19
    });

    it("should return the Monday of the previous week (offset 1)", () => {
      // Mock date: Wednesday, Jan 22, 2026
      const date = new Date("2026-01-22T12:00:00Z");
      const lastMonday = getStartOfMondayWeek(date, 1);

      expect(lastMonday.toISOString()).toContain("2026-01-12"); // Monday Jan 12
    });

    it("should correctly identify Monday when current day is Sunday", () => {
      // Mock date: Sunday, Jan 25, 2026
      const date = new Date("2026-01-25T12:00:00Z");
      const monday = getStartOfMondayWeek(date, 0);

      expect(monday.toISOString()).toContain("2026-01-19"); // Monday Jan 19
    });

    it("should correctly identify Monday when current day is Monday", () => {
      // Mock date: Monday, Jan 19, 2026
      const date = new Date("2026-01-19T12:00:00Z");
      const monday = getStartOfMondayWeek(date, 0);

      expect(monday.toISOString()).toContain("2026-01-19"); // Monday Jan 19
    });
  });

  describe("getWeekRangeLabel", () => {
    it("should format the range correctly for the current week", () => {
      // Mock date: Wednesday, Jan 22, 2026
      const date = new Date("2026-01-22T12:00:00Z");
      const label = getWeekRangeLabel(date, 0);

      // Week is Mon Jan 19 - Sun Jan 25
      expect(label).toBe("Jan 19 - Jan 25");
    });

    it("should format the range correctly for the last week", () => {
      // Mock date: Wednesday, Jan 22, 2026
      const date = new Date("2026-01-22T12:00:00Z");
      const label = getWeekRangeLabel(date, 1);

      // Week is Mon Jan 12 - Sun Jan 18
      expect(label).toBe("Jan 12 - Jan 18");
    });
  });
});
