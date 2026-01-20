import { describe, expect, it } from "vitest";
import { formatDuration, formatDurationDetailed, normalizeTime, parseTime } from "@/utils/time";

describe("Time Utils", () => {
  describe("formatDurationDetailed", () => {
    it("should show minutes if less than 1 hour", () => {
      expect(formatDurationDetailed(30 * 60 * 1000)).toBe("30m");
    });

    it("should show hours and minutes if 1 hour or more", () => {
      expect(formatDurationDetailed(90 * 60 * 1000)).toBe("1h 30m");
    });

    it("should show only hours if minutes are 0", () => {
      expect(formatDurationDetailed(60 * 60 * 1000)).toBe("1h 0m");
    });

    it("should round minutes down", () => {
      // 1h 30m 45s -> 1h 30m
      expect(formatDurationDetailed(90 * 60 * 1000 + 45000)).toBe("1h 30m");
    });

    it("should handle 0", () => {
      expect(formatDurationDetailed(0)).toBe("0m");
    });
  });

  describe("formatDuration", () => {
    it("should show seconds if less than 1 minute", () => {
      expect(formatDuration(45000)).toBe("45s");
      expect(formatDuration(500)).toBe("0s");
    });

    it("should show minutes if less than 1 hour", () => {
      expect(formatDuration(60000)).toBe("1m");
      expect(formatDuration(3540000)).toBe("59m");
    });

    it("should show hours with decimals if 1 hour or more", () => {
      expect(formatDuration(3600000)).toBe("1h");
      expect(formatDuration(5400000)).toBe("1.5h");
      expect(formatDuration(7200000)).toBe("2h");
    });
  });

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
