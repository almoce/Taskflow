import { describe, expect, it } from "vitest";
import { normalizeTime, parseTime } from "@/utils/time";

describe("Time Utils", () => {
  describe("normalizeTime", () => {
    it("should calculate milliseconds correctly for standard inputs", () => {
      expect(normalizeTime(1, 1, 1)).toBe(3661000);
    });

    it("should handle seconds overflow", () => {
      // 0h, 0m, 90s -> 90s -> 90000ms
      expect(normalizeTime(0, 0, 90)).toBe(90000);
    });

    it("should handle minutes overflow", () => {
      // 0h, 90m, 0s -> 5400s -> 5400000ms
      expect(normalizeTime(0, 90, 0)).toBe(5400000);
    });

    it("should handle mixed overflows", () => {
      // 0h, 1m, 90s -> 150s -> 150000ms
      expect(normalizeTime(0, 1, 90)).toBe(150000);
    });
  });

  describe("parseTime", () => {
    it("should parse milliseconds back to components", () => {
      expect(parseTime(3661000)).toEqual({ hours: 1, minutes: 1, seconds: 1 });
    });

    it("should handle large durations", () => {
      // 90000ms -> 1m 30s
      expect(parseTime(90000)).toEqual({ hours: 0, minutes: 1, seconds: 30 });
    });
  });
});
