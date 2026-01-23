import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProjectChartData } from "@/hooks/useProjectChartData";
import { useStore } from "@/store/useStore";

describe("useProjectChartData Time Aggregation", () => {
  beforeEach(() => {
    useStore.getState().reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-11T12:00:00Z")); // Jan 11 is Sun
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should aggregate timeSpentPerDay into chart data", () => {
    const project = useStore.getState().addProject("Test Project");
    const task1 = useStore.getState().addTask(project.id, "Task 1");
    const task2 = useStore.getState().addTask(project.id, "Task 2");

    // Jan 11 (Sun): 1h on task1
    vi.setSystemTime(new Date("2026-01-11T12:00:00Z"));
    useStore.getState().updateTaskTime(task1.id, 3600000);

    // Verify task state directly
    const t1 = useStore.getState().tasks.find((t) => t.id === task1.id);
    expect(t1?.timeSpentPerDay?.["2026-01-11"]).toBe(3600000);

    // Jan 10 (Sat): 30m on task1, 30m on task2
    vi.setSystemTime(new Date("2026-01-10T12:00:00Z"));
    useStore.getState().updateTaskTime(task1.id, 1800000);
    useStore.getState().updateTaskTime(task2.id, 1800000);

    // Set time back to "today" (Sun Jan 11) before hook runs
    vi.setSystemTime(new Date("2026-01-11T12:00:00Z"));

    const { result } = renderHook(() => useProjectChartData(project.id, "week"));

    // Verify Sun (Jan 11)
    const sunData = result.current.find((d) => d.date === "Sun");
    expect(sunData?.timeSpent).toBe(1); // 1 hour

    // Verify Sat (Jan 10)
    const satData = result.current.find((d) => d.date === "Sat");
    expect(satData?.timeSpent).toBe(1); // 30m + 30m = 1 hour

    // Verify Fri (Jan 09)
    const friData = result.current.find((d) => d.date === "Fri");
    expect(friData?.timeSpent).toBe(0);
  });
});
