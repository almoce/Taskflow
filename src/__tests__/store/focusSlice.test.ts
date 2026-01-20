import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "@/store/useStore";

describe("FocusSlice", () => {
  beforeEach(() => {
    useStore.getState().reset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should track time spent per day correctly", () => {
    // Setup: Create task
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    
    // Set a specific date
    const dateStr = "2024-01-20";
    vi.setSystemTime(new Date(dateStr + "T12:00:00Z"));

    // Action: Update time
    useStore.getState().updateTaskTime(task.id, 3600000); // 1 hour

    // Verify
    const updatedTask = useStore.getState().tasks.find(t => t.id === task.id);
    expect(updatedTask?.totalTimeSpent).toBe(3600000);
    expect(updatedTask?.timeSpentPerDay).toBeDefined();
    // Keys in Record<string, number> are ISO date strings YYYY-MM-DD usually, 
    // but I need to decide on the key format. ISO date string YYYY-MM-DD is standard.
    expect(updatedTask?.timeSpentPerDay?.[dateStr]).toBe(3600000);
  });

  it("should accumulate time for the same day", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    const dateStr = "2024-01-20";
    vi.setSystemTime(new Date(dateStr + "T12:00:00Z"));

    useStore.getState().updateTaskTime(task.id, 1000);
    useStore.getState().updateTaskTime(task.id, 2000);

    const updatedTask = useStore.getState().tasks.find(t => t.id === task.id);
    expect(updatedTask?.timeSpentPerDay?.[dateStr]).toBe(3000);
  });

  it("should track time for different days separately", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    
    // Day 1
    const date1 = "2024-01-20";
    vi.setSystemTime(new Date(date1 + "T12:00:00Z"));
    useStore.getState().updateTaskTime(task.id, 1000);

    // Day 2
    const date2 = "2024-01-21";
    vi.setSystemTime(new Date(date2 + "T12:00:00Z"));
    useStore.getState().updateTaskTime(task.id, 2000);

    const updatedTask = useStore.getState().tasks.find(t => t.id === task.id);
    expect(updatedTask?.timeSpentPerDay?.[date1]).toBe(1000);
    expect(updatedTask?.timeSpentPerDay?.[date2]).toBe(2000);
    expect(updatedTask?.totalTimeSpent).toBe(3000);
  });
});
