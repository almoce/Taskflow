import type { StateCreator } from "zustand";
import type { StoreState, SyncSlice } from "../types";

export const createSyncSlice: StateCreator<StoreState, [], [], SyncSlice> = (set) => ({
  pendingDeleteProjectIds: [],
  pendingDeleteTaskIds: [],
  addToPendingDelete: (type, id) =>
    set((state) => {
      const key = type === "project" ? "pendingDeleteProjectIds" : "pendingDeleteTaskIds";
      if (state[key].includes(id)) return state;
      return {
        ...state,
        [key]: [...state[key], id],
      };
    }),
  removeFromPendingDelete: (type, id) =>
    set((state) => {
      const key = type === "project" ? "pendingDeleteProjectIds" : "pendingDeleteTaskIds";
      return {
        ...state,
        [key]: state[key].filter((itemId) => itemId !== id),
      };
    }),
});
