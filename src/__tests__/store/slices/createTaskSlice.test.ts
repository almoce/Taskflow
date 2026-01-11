import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";

describe("createTaskSlice", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("should set completedAt to now when marking done if not provided", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    
    useStore.getState().updateTask(task.id, { status: "done" });
    
    const updatedTask = useStore.getState().tasks.find((t) => t.id === task.id);
    expect(updatedTask?.status).toBe("done");
    expect(updatedTask?.completedAt).toBeDefined();
    // Verify it's recent (within last second)
    const now = new Date().getTime();
    const completedAt = new Date(updatedTask!.completedAt!).getTime();
    expect(now - completedAt).toBeLessThan(1000);
  });

  it("should respect provided completedAt when marking done", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    
    const historicalDate = "2025-01-01T12:00:00.000Z";
    useStore.getState().updateTask(task.id, { status: "done", completedAt: historicalDate });
    
    const updatedTask = useStore.getState().tasks.find((t) => t.id === task.id);
    expect(updatedTask?.status).toBe("done");
    expect(updatedTask?.completedAt).toBe(historicalDate);
  });
});
