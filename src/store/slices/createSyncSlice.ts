import type { StateCreator } from "zustand";
import type { StoreState, SyncSlice } from "../types";

export const createSyncSlice: StateCreator<StoreState, [], [], SyncSlice> = (set) => ({
  pendingDeleteProjectIds: [],
  pendingDeleteTaskIds: [],
  pendingDeleteArchivedTaskIds: [],
  addToPendingDelete: (type, id) =>
    set((state) => {
      const key =
        type === "project"
          ? "pendingDeleteProjectIds"
          : type === "task"
            ? "pendingDeleteTaskIds"
            : "pendingDeleteArchivedTaskIds";
      if (state[key].includes(id)) return state;
      return {
        ...state,
        [key]: [...state[key], id],
      };
    }),
  removeFromPendingDelete: (type, id) =>
    set((state) => {
      const key =
        type === "project"
          ? "pendingDeleteProjectIds"
          : type === "task"
            ? "pendingDeleteTaskIds"
            : "pendingDeleteArchivedTaskIds";
      return {
        ...state,
        [key]: state[key].filter((itemId) => itemId !== id),
      };
    }),
});
