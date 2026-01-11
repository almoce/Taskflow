import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
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
      }),
    },
  ),
);

// Granular Hooks for Performance
export const useProjects = () => useStore(useShallow((state) => ({
  projects: state.projects,
  selectedProjectId: state.selectedProjectId,
  addProject: state.addProject,
  updateProject: state.updateProject,
  deleteProject: state.deleteProject,
  selectProject: state.selectProject,
  importProject: state.importProject,
  getProjectExportData: state.getProjectExportData,
})));

export const useTasks = () => useStore(useShallow((state) => ({
  tasks: state.tasks,
  addTask: state.addTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  moveTask: state.moveTask,
  archiveTask: state.archiveTask,
  unarchiveTask: state.unarchiveTask,
  checkAutoArchive: state.checkAutoArchive,
})));

export const useUI = () => useStore(useShallow((state) => ({
  activeView: state.activeView,
  setActiveView: state.setActiveView,
})));

export const useStoreActions = () => useStore(useShallow((state) => ({
  reset: state.reset,
})));