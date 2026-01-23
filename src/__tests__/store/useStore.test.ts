import { beforeEach, describe, expect, it } from "vitest";
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

  it("should pause focus session and record time", () => {
    const project = useStore.getState().addProject("Test Project");
    const task = useStore.getState().addTask(project.id, "Test Task");

    useStore.getState().startFocusSession(task.id);
    expect(useStore.getState().isFocusModeActive).toBe(true);

    // Pause session with 5 minutes elapsed
    useStore.getState().pauseFocusSession(300000);

    const state = useStore.getState();
    expect(state.isFocusModeActive).toBe(false);
    expect(state.tasks[0].totalTimeSpent).toBe(300000);
    expect(state.activeFocusTaskId).toBeNull();
  });
});
