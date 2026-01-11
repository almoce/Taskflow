import { renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { useProjectStats } from "@/hooks/useProjectStats";
import { taskStore } from "@/hooks/useTaskStore";

describe("useProjectStats", () => {
  beforeEach(() => {
    taskStore.getState().reset();
  });

  it("should return empty stats when no project is provided", () => {
    const { result } = renderHook(() => useProjectStats(null));
    expect(result.current).toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      progress: 0,
    });
  });

  it("should return correct stats for a specific project", () => {
    const project = taskStore.getState().addProject("Test Project");
    const projectId = project.id;

    taskStore.getState().addTask(projectId, "Task 1", "medium"); // todo
    taskStore.getState().addTask(projectId, "Task 2", "medium");
    taskStore.getState().updateTask(taskStore.getState().tasks[1].id, { status: "in-progress" });
    taskStore.getState().addTask(projectId, "Task 3", "medium");
    taskStore.getState().updateTask(taskStore.getState().tasks[2].id, { status: "done" });

    // Add task to another project (should be ignored)
    const otherProject = taskStore.getState().addProject("Other Project");
    taskStore.getState().addTask(otherProject.id, "Other Task", "medium");

    const { result } = renderHook(() => useProjectStats(projectId));

    expect(result.current).toEqual({
      total: 3,
      todo: 1,
      inProgress: 1,
      done: 1,
      progress: 33, // (1/3) * 100 = 33.33 -> 33
    });
  });

  it("should return empty stats for a project with no tasks", () => {
    const project = taskStore.getState().addProject("Empty Project");
    const { result } = renderHook(() => useProjectStats(project.id));
    expect(result.current).toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      progress: 0,
    });
  });
});
