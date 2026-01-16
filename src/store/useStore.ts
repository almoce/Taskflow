import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { createAuthSlice } from "./slices/createAuthSlice";
import { createProjectSlice } from "./slices/createProjectSlice";
import { createSettingsSlice } from "./slices/createSettingsSlice";
import { createSyncSlice } from "./slices/createSyncSlice";
import { createTaskSlice } from "./slices/createTaskSlice";
import { createUISlice } from "./slices/createUISlice";
import type { StoreState } from "./types";

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createProjectSlice(set, get, api),
      ...createTaskSlice(set, get, api),
      ...createUISlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      ...createAuthSlice(set, get, api),
      ...createSyncSlice(set, get, api),

      reset: () => {
        set({
          projects: [],
          tasks: [],
          selectedProjectId: null,
          activeView: "tasks",
          pendingDeleteProjectIds: [],
          pendingDeleteTaskIds: [],
          // We generally don't want to log the user out on reset() unless specified
        });
      },
    }),
    {
      name: "task-manager-data",
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        selectedProjectId: state.selectedProjectId,
        columnSorts: state.columnSorts,
        // We persist session to keep user logged in
        session: state.session,
        user: state.user,
        profile: state.profile,
        isPro: state.isPro,
        pendingDeleteProjectIds: state.pendingDeleteProjectIds,
        pendingDeleteTaskIds: state.pendingDeleteTaskIds,
      }),
    },
  ),
);

// Granular Hooks for Performance
export const useProjects = () =>
  useStore(
    useShallow((state) => ({
      projects: state.projects,
      selectedProjectId: state.selectedProjectId,
      addProject: state.addProject,
      updateProject: state.updateProject,
      deleteProject: state.deleteProject,
      selectProject: state.selectProject,
      importProject: state.importProject,
      getProjectExportData: state.getProjectExportData,
    })),
  );

export const useTasks = () =>
  useStore(
    useShallow((state) => ({
      tasks: state.tasks,
      columnSorts: state.columnSorts,
      addTask: state.addTask,
      updateTask: state.updateTask,
      deleteTask: state.deleteTask,
      moveTask: state.moveTask,
      archiveTask: state.archiveTask,
      unarchiveTask: state.unarchiveTask,
      checkAutoArchive: state.checkAutoArchive,
      setColumnSort: state.setColumnSort,
    })),
  );

export const useUI = () =>
  useStore(
    useShallow((state) => ({
      activeView: state.activeView,
      setActiveView: state.setActiveView,
    })),
  );

export const useAuth = () =>
  useStore(
    useShallow((state) => ({
      session: state.session,
      user: state.user,
      profile: state.profile,
      isPro: state.isPro,
      loading: state.loading,
      setSession: state.setSession,
      fetchProfile: state.fetchProfile,
      signOut: state.signOut,
    })),
  );

export const useStoreActions = () =>
  useStore(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );
