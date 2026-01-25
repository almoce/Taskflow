import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { isTaskFromPreviousWeeks } from "../../utils/time";
import type { Task } from "../../types/task";

describe("isTaskFromPreviousWeeks", () => {
  // Today is Saturday, Jan 24, 2026
  const today = new Date("2026-01-24T12:00:00Z");
  // Monday of this week was Jan 19, 2026
  const mondayThisWeek = new Date("2026-01-19T00:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(today);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockTask = (completedAt: string | undefined, status: Task["status"] = "done"): Task => ({
    id: "t1",
    projectId: "p1",
    title: "Test Task",
    status,
    priority: "medium",
    subtasks: [],
    createdAt: new Date().toISOString(),
    completedAt,
    isArchived: false,
  });

  it("should return true for a task completed last week (Sunday)", () => {
    const lastSunday = new Date("2026-01-18T23:59:59Z");
    const task = createMockTask(lastSunday.toISOString());
    expect(isTaskFromPreviousWeeks(task)).toBe(true);
  });

  it("should return false for a task completed this Monday at 00:01", () => {
    const thisMonday = new Date("2026-01-19T00:01:00Z");
    const task = createMockTask(thisMonday.toISOString());
    expect(isTaskFromPreviousWeeks(task)).toBe(false);
  });

  it("should return false for a task completed today", () => {
    const task = createMockTask(today.toISOString());
    expect(isTaskFromPreviousWeeks(task)).toBe(false);
  });

  it("should return false for a task that is not done", () => {
    const lastSunday = new Date("2026-01-18T23:59:59Z");
    const task = createMockTask(lastSunday.toISOString(), "todo");
    expect(isTaskFromPreviousWeeks(task)).toBe(false);
  });

  it("should return false for a task without a completedAt date", () => {
    const task = createMockTask(undefined);
    expect(isTaskFromPreviousWeeks(task)).toBe(false);
  });

  it("should return true for a task completed weeks ago", () => {
    const weeksAgo = new Date("2025-12-01T12:00:00Z");
    const task = createMockTask(weeksAgo.toISOString());
    expect(isTaskFromPreviousWeeks(task)).toBe(true);
  });
});
