import type { StateCreator } from "zustand";
import type { ArchivedTaskSlice, StoreState } from "../types";

export const createArchivedTaskSlice: StateCreator<StoreState, [], [], ArchivedTaskSlice> = (
  set,
  get,
) => ({
  archivedTasks: [],

  upsertArchivedTask: (task) => {
    set((state) => {
      const exists = state.archivedTasks.some((t) => t.id === task.id);
      if (exists) {
        return {
          archivedTasks: state.archivedTasks.map((t) => (t.id === task.id ? task : t)),
        };
      }
      return {
        archivedTasks: [...state.archivedTasks, task],
      };
    });
  },

  deleteArchivedTask: (id) => {
    // Add to pending deletes for sync propagation (if needed,
    // though ArchivedTasks might have its own sync logic later)
    // The current SyncSlice only has pendingDeleteTaskIds which might
    // be shared between active and archived.
    // Let's assume they share the deletion queue.
    if ("addToPendingDelete" in get()) {
      (get() as any).addToPendingDelete("archived_task", id);
    }

    set((state) => ({
      archivedTasks: state.archivedTasks.filter((t) => t.id !== id),
    }));
  },
});
