import { describe, expect, it, vi, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";

describe("FocusSlice", () => {
  beforeEach(() => {
    useStore.getState().reset();
    vi.clearAllMocks();
  });

  it("should start a focus session and update task status", () => {
    const { addTask, startFocusSession } = useStore.getState();
    const task = addTask("p1", "Test Task");
    
    expect(task.status).toBe("todo");
    
    startFocusSession(task.id);
    
    const state = useStore.getState();
    expect(state.activeFocusTaskId).toBe(task.id);
    expect(state.isFocusModeActive).toBe(true);
    
    const updatedTask = state.tasks.find(t => t.id === task.id);
    expect(updatedTask?.status).toBe("in-progress");
  });

  it("should end a focus session", () => {
    const { startFocusSession, endFocusSession } = useStore.getState();
    startFocusSession("t1");
    
    expect(useStore.getState().isFocusModeActive).toBe(true);
    
    endFocusSession();
    
    expect(useStore.getState().isFocusModeActive).toBe(false);
    expect(useStore.getState().activeFocusTaskId).toBe(null);
  });

  it("should update task duration", () => {
    const { addTask, updateTaskTime } = useStore.getState();
    const task = addTask("p1", "Time Task");
    
    updateTaskTime(task.id, 5000); // 5 seconds
    
    let updatedTask = useStore.getState().tasks.find(t => t.id === task.id);
    expect(updatedTask?.totalTimeSpent).toBe(5000);
    
    updateTaskTime(task.id, 3000); // +3 seconds
    
    updatedTask = useStore.getState().tasks.find(t => t.id === task.id);
    expect(updatedTask?.totalTimeSpent).toBe(8000);
  });
});
