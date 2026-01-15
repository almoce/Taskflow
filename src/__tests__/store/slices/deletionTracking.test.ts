import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";

describe("Deletion Tracking", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("should add project ID to pendingDeleteProjectIds when a project is deleted", () => {
    const project = useStore.getState().addProject("Project to delete");
    const projectId = project.id;
    
    useStore.getState().deleteProject(projectId);
    
    const state = useStore.getState();
    expect(state.pendingDeleteProjectIds).toContain(projectId);
    expect(state.projects.find(p => p.id === projectId)).toBeUndefined();
  });

  it("should add task ID to pendingDeleteTaskIds when a task is deleted", () => {
    const project = useStore.getState().addProject("Project");
    const task = useStore.getState().addTask(project.id, "Task to delete");
    const taskId = task.id;
    
    useStore.getState().deleteTask(taskId);
    
    const state = useStore.getState();
    expect(state.pendingDeleteTaskIds).toContain(taskId);
    expect(state.tasks.find(t => t.id === taskId)).toBeUndefined();
  });
});
