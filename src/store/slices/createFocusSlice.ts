import type { StateCreator } from "zustand";
import type { StoreState, FocusSlice } from "../types";

export const createFocusSlice: StateCreator<StoreState, [], [], FocusSlice> = (set, get) => ({
  activeFocusTaskId: null,
  isFocusModeActive: false,

  startFocusSession: (taskId: string) => {
    // Also move task to in-progress if it's not already
    const task = get().tasks.find((t) => t.id === taskId);
    if (task && task.status !== "in-progress") {
      get().updateTask(taskId, { status: "in-progress" });
    }

    set({
      activeFocusTaskId: taskId,
      isFocusModeActive: true,
    });
  },

  endFocusSession: () => {
    set({
      activeFocusTaskId: null,
      isFocusModeActive: false,
    });
  },

  updateTaskTime: (taskId: string, duration: number) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentTotal = task.totalTimeSpent || 0;
    get().updateTask(taskId, {
      totalTimeSpent: currentTotal + duration,
    });
  },
});
