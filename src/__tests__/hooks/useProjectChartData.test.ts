import { renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { useProjectChartData } from "@/hooks/useProjectChartData";
import { useStore } from "@/store/useStore";
import { startOfDay, subDays, format } from "date-fns";

describe("useProjectChartData", () => {
  beforeEach(() => {
    useStore.getState().reset();
    // Mock date to ensure consistent results
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-11T12:00:00Z"));
  });

  it("should return empty data when no projectId is provided", () => {
    const { result } = renderHook(() => useProjectChartData(null));
    expect(result.current).toEqual([]);
  });

  it("should return 7 days of data for a specific project", () => {
    const project = useStore.getState().addProject("Test Project");
    const projectId = project.id;

    // Create a task today
    useStore.getState().addTask(projectId, "Task Today", "medium");
    
    // Create a task 2 days ago and complete it today
    vi.setSystemTime(new Date("2026-01-09T12:00:00Z"));
    const taskOld = useStore.getState().addTask(projectId, "Task Old", "medium");
    
    vi.setSystemTime(new Date("2026-01-11T12:00:00Z"));
    useStore.getState().updateTask(taskOld.id, { status: "done" });

    const { result } = renderHook(() => useProjectChartData(projectId, "week"));

    expect(result.current).toHaveLength(7);
    
    // Today (Jan 11) is Sunday (Sun)
    const todayData = result.current.find(d => d.date === "Sun");
    expect(todayData).toBeDefined();
    expect(todayData?.completed).toBe(1);
    expect(todayData?.created).toBe(1); // One created today

    // Friday (Jan 9)
    const fridayData = result.current.find(d => d.date === "Fri");
    expect(fridayData?.created).toBe(1);
    expect(fridayData?.completed).toBe(0);
  });

  it("should return weekly data for a month time range", () => {
    const project = useStore.getState().addProject("Month Project");
    const { result } = renderHook(() => useProjectChartData(project.id, "month"));

    // subMonths(today, 1) to today usually covers 5-6 weeks depending on dates
    expect(result.current.length).toBeGreaterThanOrEqual(4);
    expect(result.current[0]).toHaveProperty("fullDate");
    expect(result.current[0]).toHaveProperty("completed");
  });
});
