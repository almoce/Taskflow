import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

export const STORAGE_KEYS = {
  PROJECTS: "storage-projects",
  TASKS: "storage-tasks",
  ARCHIVE: "storage-archive",
  AUTH: "storage-auth",
  SETTINGS: "storage-settings",
  LEGACY: "task-manager-data",
};

export const migrateStorage = async (): Promise<void> => {
  try {
    const legacyData = await get(STORAGE_KEYS.LEGACY);
    if (!legacyData) return;

    let parsed;
    try {
      parsed = JSON.parse(legacyData);
    } catch (e) {
      console.error("Failed to parse legacy storage data during migration", e);
      return;
    }

    if (!parsed?.state) return;

    const { state, version } = parsed;

    // Helper to wrap state in Zustand structure
    const wrap = (partialState: Record<string, any>) =>
      JSON.stringify({ state: partialState, version });

    // 1. Projects
    if (state.projects) {
      await set(
        STORAGE_KEYS.PROJECTS,
        wrap({
          projects: state.projects,
          selectedProjectId: state.selectedProjectId,
          pendingDeleteProjectIds: state.pendingDeleteProjectIds,
        }),
      );
    }

    // 2. Tasks
    if (state.tasks) {
      await set(
        STORAGE_KEYS.TASKS,
        wrap({
          tasks: state.tasks,
          columnSorts: state.columnSorts,
          pendingDeleteTaskIds: state.pendingDeleteTaskIds,
          previousTaskStatus: state.previousTaskStatus,
        }),
      );
    }

    // 3. Archive
    if (state.archivedTasks) {
      await set(
        STORAGE_KEYS.ARCHIVE,
        wrap({
          archivedTasks: state.archivedTasks,
          pendingDeleteArchivedTaskIds: state.pendingDeleteArchivedTaskIds,
        }),
      );
    }

    // 4. Auth
    if (state.session || state.user) {
      await set(
        STORAGE_KEYS.AUTH,
        wrap({
          session: state.session,
          user: state.user,
          profile: state.profile,
          isPro: state.isPro,
        }),
      );
    }

    // 5. Settings / UI
    // We can group these or split them further. For now, let's keep them separate or put them in UI store if we had one.
    // Based on design.md, we have a SETTINGS key, but let's check what state we have.
    // activeView, isFocusModeActive, activeFocusTaskId are UI/Settings related.
    if (state.activeView || state.isFocusModeActive) {
      await set(
        STORAGE_KEYS.SETTINGS,
        wrap({
          activeView: state.activeView,
          isFocusModeActive: state.isFocusModeActive,
          activeFocusTaskId: state.activeFocusTaskId,
        }),
      );
    }

    // Cleanup legacy
    await del(STORAGE_KEYS.LEGACY);
    console.log("Successfully migrated local storage to granular keys.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};
