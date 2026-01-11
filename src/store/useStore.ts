import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreState } from "./types";
import { createProjectSlice } from "./slices/createProjectSlice";
import { createTaskSlice } from "./slices/createTaskSlice";
import { createUISlice } from "./slices/createUISlice";
import { createSettingsSlice } from "./slices/createSettingsSlice";

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createProjectSlice(set, get, api),
      ...createTaskSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createSettingsSlice(set, get, api),

      reset: () => {
        set({
          projects: [],
          tasks: [],
          selectedProjectId: null,
          activeView: "tasks",
        });
      },
    }),
    {
      name: "task-manager-data",
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        selectedProjectId: state.selectedProjectId,
        // activeView is transient and excluded from persistence
      }),
    },
  ),
);
