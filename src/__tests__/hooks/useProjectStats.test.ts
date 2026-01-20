import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStats } from "@/hooks/useProjectStats";
import { useStore } from "@/store/useStore";

describe("useProjectStats", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("should return empty stats when no project is provided", () => {
    const { result } = renderHook(() => useProjectStats(null));
    expect(result.current).toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      progress: 0,
      totalTimeSpent: 0,
    });
  });

  it("should return correct stats for a specific project", () => {
    const project = useStore.getState().addProject("Test Project");
    const projectId = project.id;

    useStore.getState().addTask(projectId, "Task 1", "medium"); // todo
    useStore.getState().addTask(projectId, "Task 2", "medium");
    useStore.getState().updateTask(useStore.getState().tasks[1].id, { status: "in-progress" });
    useStore.getState().addTask(projectId, "Task 3", "medium");
    useStore.getState().updateTask(useStore.getState().tasks[2].id, { status: "done" });

    // Add task to another project (should be ignored)
    const otherProject = useStore.getState().addProject("Other Project");
    useStore.getState().addTask(otherProject.id, "Other Task", "medium");

    const { result } = renderHook(() => useProjectStats(projectId));

    expect(result.current).toEqual({
      total: 3,
      todo: 1,
      inProgress: 1,
      done: 1,
      progress: 33, // (1/3) * 100 = 33.33 -> 33
      totalTimeSpent: 0,
    });
  });

  it("should ignore archived tasks", () => {
    const project = useStore.getState().addProject("Project With Archived");
    const projectId = project.id;

    // Add active task
    useStore.getState().addTask(projectId, "Active Task", "medium");

    // Add task and archive it
    const task = useStore.getState().addTask(projectId, "To Archive", "medium");
    useStore.getState().archiveTask(task.id);

    const { result } = renderHook(() => useProjectStats(projectId));

    expect(result.current).toEqual({
      total: 1,
      todo: 1,
      inProgress: 0,
      done: 0,
      progress: 0,
      totalTimeSpent: 0,
    });
  });

  it("should return empty stats for a project with no tasks", () => {
    const project = useStore.getState().addProject("Empty Project");
    const { result } = renderHook(() => useProjectStats(project.id));
    expect(result.current).toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      progress: 0,
      totalTimeSpent: 0,
    });
  });
});
