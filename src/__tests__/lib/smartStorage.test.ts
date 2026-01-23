import { get, set } from "idb-keyval";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { smartStorageAdapter } from "@/lib/smartStorage";
import { STORAGE_KEYS } from "@/lib/storage";

vi.mock("idb-keyval");

describe("smartStorageAdapter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Clear any internal state of the adapter if necessary
  });

  describe("getItem", () => {
    it("should return null if no storage keys exist", async () => {
      (get as any).mockResolvedValue(undefined);

      const result = await smartStorageAdapter.getItem("task-manager-data");
      expect(result).toBeNull();
    });

    it("should merge granular keys into a single state object", async () => {
      (get as any).mockImplementation((key: string) => {
        if (key === STORAGE_KEYS.PROJECTS)
          return JSON.stringify({ state: { projects: [{ id: "p1" }] }, version: 0 });
        if (key === STORAGE_KEYS.TASKS)
          return JSON.stringify({ state: { tasks: [{ id: "t1" }] }, version: 0 });
        if (key === STORAGE_KEYS.ARCHIVE)
          return JSON.stringify({ state: { archivedTasks: [] }, version: 0 });
        if (key === STORAGE_KEYS.AUTH)
          return JSON.stringify({ state: { session: { user: "u1" } }, version: 0 });
        if (key === STORAGE_KEYS.SETTINGS)
          return JSON.stringify({ state: { activeView: "calendar" }, version: 0 });
        return undefined;
      });

      const result = await smartStorageAdapter.getItem("task-manager-data");
      const parsed = JSON.parse(result!);

      expect(parsed.state.projects).toHaveLength(1);
      expect(parsed.state.tasks).toHaveLength(1);
      expect(parsed.state.session.user).toBe("u1");
      expect(parsed.state.activeView).toBe("calendar");
    });

    it("should migrate legacy data if granular keys are missing but legacy key exists", async () => {
      // This test simulates the adapter initiating migration or falling back
      // For our implementation, we want migrateStorage to be called explicitly at app start,
      // but the adapter can also just read legacy if it exists as a fallback.
      (get as any).mockImplementation((key: string) => {
        if (key === STORAGE_KEYS.LEGACY)
          return JSON.stringify({ state: { projects: [{ id: "legacy" }] }, version: 0 });
        return undefined;
      });

      const result = await smartStorageAdapter.getItem("task-manager-data");
      const parsed = JSON.parse(result!);
      expect(parsed.state.projects[0].id).toBe("legacy");
    });
  });

  describe("setItem", () => {
    it("should split state and write to granular keys", async () => {
      const fullState = {
        state: {
          projects: [{ id: "p1" }],
          tasks: [{ id: "t1" }],
          archivedTasks: [],
          session: { user: "u1" },
          activeView: "calendar",
        },
        version: 0,
      };

      await smartStorageAdapter.setItem("task-manager-data", JSON.stringify(fullState));

      // Verify individual writes
      expect(set).toHaveBeenCalledWith(
        STORAGE_KEYS.PROJECTS,
        expect.stringContaining('"projects":[{"id":"p1"}]'),
      );
      expect(set).toHaveBeenCalledWith(
        STORAGE_KEYS.TASKS,
        expect.stringContaining('"tasks":[{"id":"t1"}]'),
      );
    });

    it("should NOT write if partial state has not changed (optimization)", async () => {
      // 1. Write Initial State
      const initialState = {
        state: { projects: [{ id: "p1" }], tasks: [{ id: "t1" }] },
        version: 0,
      };
      await smartStorageAdapter.setItem("task-manager-data", JSON.stringify(initialState));
      vi.clearAllMocks();

      // 2. Write Same State again
      await smartStorageAdapter.setItem("task-manager-data", JSON.stringify(initialState));
      expect(set).not.toHaveBeenCalled();

      // 3. Write Changed Projects only
      const newState = {
        state: { projects: [{ id: "p1" }, { id: "p2" }], tasks: [{ id: "t1" }] },
        version: 0,
      };
      await smartStorageAdapter.setItem("task-manager-data", JSON.stringify(newState));
      expect(set).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS, expect.anything());
      expect(set).not.toHaveBeenCalledWith(STORAGE_KEYS.TASKS, expect.anything());
    });
  });
});
