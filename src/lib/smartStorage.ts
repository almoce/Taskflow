import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "./storage";

// In-memory cache to detect changes and avoid redundant writes
let lastPersistedState: any = {};

const safeJSONParse = (str: string | undefined | null) => {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const smartStorageAdapter: StateStorage = {
  getItem: async (_name: string): Promise<string | null> => {
    // 1. Try to load all granular keys in parallel
    const [projects, tasks, archive, auth, settings] = await Promise.all([
      get(STORAGE_KEYS.PROJECTS),
      get(STORAGE_KEYS.TASKS),
      get(STORAGE_KEYS.ARCHIVE),
      get(STORAGE_KEYS.AUTH),
      get(STORAGE_KEYS.SETTINGS),
    ]);

    // 2. Fallback: Check for legacy data if no granular data found
    if (!projects && !tasks && !archive && !auth && !settings) {
      const legacy = await get(STORAGE_KEYS.LEGACY);
      if (legacy) {
        // Cache legacy state so subsequent writes can diff against it
        lastPersistedState = safeJSONParse(legacy)?.state || {};
        return legacy;
      }
      return null;
    }

    // 3. Merge granular data
    const parsedProjects = safeJSONParse(projects);
    const parsedTasks = safeJSONParse(tasks);
    const parsedArchive = safeJSONParse(archive);
    const parsedAuth = safeJSONParse(auth);
    const parsedSettings = safeJSONParse(settings);

    // Reconstruct the full monolithic state object that Zustand expects
    const fullState = {
      ...parsedProjects?.state,
      ...parsedTasks?.state,
      ...parsedArchive?.state,
      ...parsedAuth?.state,
      ...parsedSettings?.state,
    };

    const version = parsedProjects?.version || 0; // Assume same version for all

    // Update cache
    lastPersistedState = fullState;

    return JSON.stringify({ state: fullState, version });
  },

  setItem: async (_name: string, value: string): Promise<void> => {
    const parsed = safeJSONParse(value);
    if (!parsed || !parsed.state) return;

    const { state, version } = parsed;
    const wrap = (partial: any) => JSON.stringify({ state: partial, version });

    const promises: Promise<void>[] = [];

    // Helper to check deep equality (simple version for now) or just reference check if Zustand uses immutable updates
    // Since we are serializing anyway, string comparison of specific slice is robust enough for now
    const _hasChanged = (slice: any, key: string) => {
      // Optimization: In a real deep comparison, we'd do better.
      // For now, let's compare JSON strings of the specific keys we care about.
      // But since 'state' is the whole object, we construct the slice.
      return JSON.stringify(slice) !== JSON.stringify(pickSlice(lastPersistedState, key));
    };

    // Define what goes into each bucket (duplicated logic from migrateStorage, should ideally share config)
    const projectSlice = {
      projects: state.projects,
      selectedProjectId: state.selectedProjectId,
      pendingDeleteProjectIds: state.pendingDeleteProjectIds,
    };

    const taskSlice = {
      tasks: state.tasks,
      columnSorts: state.columnSorts,
      pendingDeleteTaskIds: state.pendingDeleteTaskIds,
      previousTaskStatus: state.previousTaskStatus,
    };

    const archiveSlice = {
      archivedTasks: state.archivedTasks,
      pendingDeleteArchivedTaskIds: state.pendingDeleteArchivedTaskIds,
    };

    const authSlice = {
      session: state.session,
      user: state.user,
      profile: state.profile,
      isPro: state.isPro,
    };

    const settingsSlice = {
      activeView: state.activeView,
      isFocusModeActive: state.isFocusModeActive,
      activeFocusTaskId: state.activeFocusTaskId,
    };

    // Helper to pick same keys from old state for comparison
    function pickSlice(fullState: any, type: string) {
      if (!fullState) return null;
      switch (type) {
        case "projects":
          return {
            projects: fullState.projects,
            selectedProjectId: fullState.selectedProjectId,
            pendingDeleteProjectIds: fullState.pendingDeleteProjectIds,
          };
        case "tasks":
          return {
            tasks: fullState.tasks,
            columnSorts: fullState.columnSorts,
            pendingDeleteTaskIds: fullState.pendingDeleteTaskIds,
            previousTaskStatus: fullState.previousTaskStatus,
          };
        case "archive":
          return {
            archivedTasks: fullState.archivedTasks,
            pendingDeleteArchivedTaskIds: fullState.pendingDeleteArchivedTaskIds,
          };
        case "auth":
          return {
            session: fullState.session,
            user: fullState.user,
            profile: fullState.profile,
            isPro: fullState.isPro,
          };
        case "settings":
          return {
            activeView: fullState.activeView,
            isFocusModeActive: fullState.isFocusModeActive,
            activeFocusTaskId: fullState.activeFocusTaskId,
          };
        default:
          return null;
      }
    }

    if (
      JSON.stringify(projectSlice) !== JSON.stringify(pickSlice(lastPersistedState, "projects"))
    ) {
      promises.push(set(STORAGE_KEYS.PROJECTS, wrap(projectSlice)));
    }

    if (JSON.stringify(taskSlice) !== JSON.stringify(pickSlice(lastPersistedState, "tasks"))) {
      promises.push(set(STORAGE_KEYS.TASKS, wrap(taskSlice)));
    }

    if (JSON.stringify(archiveSlice) !== JSON.stringify(pickSlice(lastPersistedState, "archive"))) {
      promises.push(set(STORAGE_KEYS.ARCHIVE, wrap(archiveSlice)));
    }

    if (JSON.stringify(authSlice) !== JSON.stringify(pickSlice(lastPersistedState, "auth"))) {
      promises.push(set(STORAGE_KEYS.AUTH, wrap(authSlice)));
    }

    if (
      JSON.stringify(settingsSlice) !== JSON.stringify(pickSlice(lastPersistedState, "settings"))
    ) {
      promises.push(set(STORAGE_KEYS.SETTINGS, wrap(settingsSlice)));
    }

    await Promise.all(promises);

    // Update cache
    lastPersistedState = state;
  },

  removeItem: async (_name: string): Promise<void> => {
    await Promise.all([
      del(STORAGE_KEYS.PROJECTS),
      del(STORAGE_KEYS.TASKS),
      del(STORAGE_KEYS.ARCHIVE),
      del(STORAGE_KEYS.AUTH),
      del(STORAGE_KEYS.SETTINGS),
      del(STORAGE_KEYS.LEGACY),
    ]);
    lastPersistedState = {};
  },
};
