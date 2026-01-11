import type { StateCreator } from "zustand";
import type { StoreState, UISlice } from "../types";

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  activeView: "tasks",

  setActiveView: (view) => {
    set({ activeView: view });
  },
});
