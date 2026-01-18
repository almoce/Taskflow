import type { StateCreator } from "zustand";
import type { StoreState, UISlice } from "../types";

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  activeView: "tasks",
  isProjectDialogOpen: false,
  editingProject: null,

  setActiveView: (view) => {
    set({ activeView: view });
  },
  setIsProjectDialogOpen: (isOpen) => {
    set({ isProjectDialogOpen: isOpen });
  },
  setEditingProject: (project) => {
    set({ editingProject: project });
  },
});
