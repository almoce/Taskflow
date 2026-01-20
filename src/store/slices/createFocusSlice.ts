import type { StateCreator } from "zustand";
import type { StoreState, FocusSlice } from "../types";

export const createFocusSlice: StateCreator<StoreState, [], [], FocusSlice> = (set, get) => ({
  activeFocusTaskId: null,
  isFocusModeActive: false,
  previousTaskStatus: null,

  startFocusSession: (taskId: string) => {
    // Also move task to in-progress if it's not already
    const task = get().tasks.find((t) => t.id === taskId);
    let previousStatus = null;
    
    if (task) {
      previousStatus = task.status;
      if (task.status !== "in-progress") {
        get().updateTask(taskId, { status: "in-progress" });
      }
    }

    set({
      activeFocusTaskId: taskId,
      isFocusModeActive: true,
      previousTaskStatus: previousStatus,
    });
  },

  pauseFocusSession: (duration: number) => {
    const { activeFocusTaskId } = get();
    if (activeFocusTaskId) {
      get().updateTaskTime(activeFocusTaskId, duration);
    }
    set({
      activeFocusTaskId: null,
      isFocusModeActive: false,
      previousTaskStatus: null,
    });
  },

  endFocusSession: () => {
    set({
      activeFocusTaskId: null,
      isFocusModeActive: false,
      previousTaskStatus: null,
    });
  },

  cancelFocusSession: () => {
    const { activeFocusTaskId, previousTaskStatus } = get();
    
    if (activeFocusTaskId && previousTaskStatus) {
      // Revert task status
      get().updateTask(activeFocusTaskId, { status: previousTaskStatus });
    }

    set({
      activeFocusTaskId: null,
      isFocusModeActive: false,
      previousTaskStatus: null,
    });
  },

  updateTaskTime: (taskId: string, duration: number) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentTotal = task.totalTimeSpent || 0;
    
    // Track daily time
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const currentDaily = task.timeSpentPerDay?.[today] || 0;
    
    get().updateTask(taskId, {
      totalTimeSpent: currentTotal + duration,
      timeSpentPerDay: {
        ...(task.timeSpentPerDay || {}),
        [today]: currentDaily + duration,
      },
    });
  },
});