import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";

describe("useStore (New Store)", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("should start with default state", () => {
    const state = useStore.getState();
    expect(state.projects).toEqual([]);
    expect(state.tasks).toEqual([]);
    expect(state.selectedProjectId).toBeNull();
    expect(state.activeView).toBe("tasks");
  });

  it("should add a project", () => {
    const project = useStore.getState().addProject("Test Project");
    const state = useStore.getState();
    expect(state.projects).toHaveLength(1);
    expect(state.projects[0]).toEqual(project);
    expect(state.selectedProjectId).toBe(project.id);
  });

  it("should add a task", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");
    const state = useStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toEqual(task);
  });

  it("should change active view", () => {
    useStore.getState().setActiveView("analytics");
    expect(useStore.getState().activeView).toBe("analytics");
  });
});
