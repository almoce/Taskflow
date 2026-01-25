import { beforeEach, describe, expect, it } from "vitest";
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
    const now = Date.now();
    const completedAt = new Date(updatedTask?.completedAt!).getTime();
    expect(now - completedAt).toBeLessThan(1000);
  });

  it("should set dueDate to now when marking done if not present", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");

    // Initially no dueDate
    expect(task.dueDate).toBeUndefined();

    useStore.getState().updateTask(task.id, { status: "done" });

    const updatedTask = useStore.getState().tasks.find((t) => t.id === task.id);
    expect(updatedTask?.status).toBe("done");
    expect(updatedTask?.dueDate).toBeDefined();

    // Verify it's recent (within last second)
    const now = Date.now();
    const dueDate = new Date(updatedTask?.dueDate!).getTime();
    expect(now - dueDate).toBeLessThan(1000);
  });

  it("should NOT overwrite existing dueDate when marking done", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    const futureDate = "2099-12-31T23:59:59.000Z";

    useStore.getState().updateTask(task.id, { dueDate: futureDate });
    useStore.getState().updateTask(task.id, { status: "done" });

    const updatedTask = useStore.getState().tasks.find((t) => t.id === task.id);
    expect(updatedTask?.status).toBe("done");
    expect(updatedTask?.dueDate).toBe(futureDate);
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

  it("should move task to archivedTasks when archiving", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");

    useStore.getState().archiveTask(task.id);

    expect(useStore.getState().tasks.find((t) => t.id === task.id)).toBeUndefined();
    expect(useStore.getState().archivedTasks.find((t) => t.id === task.id)).toBeDefined();
    expect(useStore.getState().archivedTasks.find((t) => t.id === task.id)?.isArchived).toBe(true);
  });

  it("should move task back to tasks when unarchiving", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");

    useStore.getState().archiveTask(task.id);
    useStore.getState().unarchiveTask(task.id);

    expect(useStore.getState().archivedTasks.find((t) => t.id === task.id)).toBeUndefined();
    expect(useStore.getState().tasks.find((t) => t.id === task.id)).toBeDefined();
    expect(useStore.getState().tasks.find((t) => t.id === task.id)?.isArchived).toBe(false);
  });

  it("should bulk archive multiple tasks", () => {
    const project = useStore.getState().addProject("Test Project");
    const t1 = useStore.getState().addTask(project.id, "T1");
    const t2 = useStore.getState().addTask(project.id, "T2");
    const t3 = useStore.getState().addTask(project.id, "T3");

    useStore.getState().bulkArchiveTasks([t1.id, t2.id]);

    const state = useStore.getState();
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0].id).toBe(t3.id);
    expect(state.archivedTasks.length).toBe(2);
    expect(state.archivedTasks.some((t) => t.id === t1.id)).toBe(true);
    expect(state.archivedTasks.some((t) => t.id === t2.id)).toBe(true);
    expect(state.archivedTasks.every((t) => t.isArchived)).toBe(true);
    
    // Check pending deletes
    expect(state.pendingDeleteTaskIds).toContain(t1.id);
    expect(state.pendingDeleteTaskIds).toContain(t2.id);
  });
});
