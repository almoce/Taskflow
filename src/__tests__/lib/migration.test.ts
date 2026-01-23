import { del, get, set } from "idb-keyval";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { migrateStorage, STORAGE_KEYS } from "@/lib/storage";

vi.mock("idb-keyval");

describe("migrateStorage", () => {
  const legacyKey = "task-manager-data";
  const mockLegacyData = {
    state: {
      projects: [{ id: "p1", name: "Project 1" }],
      tasks: [{ id: "t1", title: "Task 1" }],
      archivedTasks: [{ id: "at1", title: "Archived Task 1" }],
      session: { user: { id: "u1" } },
      selectedProjectId: "p1",
      columnSorts: { done: ["t1"] },
      // ... other fields
    },
    version: 0,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should do nothing if legacy data does not exist", async () => {
    (get as any).mockResolvedValue(undefined);

    await migrateStorage();

    expect(get).toHaveBeenCalledWith(legacyKey);
    expect(set).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it("should migrate data if legacy key exists", async () => {
    (get as any).mockResolvedValue(JSON.stringify(mockLegacyData));

    await migrateStorage();

    // Verify reads
    expect(get).toHaveBeenCalledWith(legacyKey);

    // Verify writes (Splitting)
    // 1. Projects
    expect(set).toHaveBeenCalledWith(
      STORAGE_KEYS.PROJECTS,
      expect.stringContaining('"projects":[{"id":"p1","name":"Project 1"}]'),
    );
    // 2. Tasks
    expect(set).toHaveBeenCalledWith(
      STORAGE_KEYS.TASKS,
      expect.stringContaining('"tasks":[{"id":"t1","title":"Task 1"}]'),
    );
    // 3. Archive
    expect(set).toHaveBeenCalledWith(
      STORAGE_KEYS.ARCHIVE,
      expect.stringContaining('"archivedTasks":[{"id":"at1","title":"Archived Task 1"}]'),
    );
    // 4. Auth
    expect(set).toHaveBeenCalledWith(
      STORAGE_KEYS.AUTH,
      expect.stringContaining('"session":{"user":{"id":"u1"}}'),
    );

    // Verify cleanup
    expect(del).toHaveBeenCalledWith(legacyKey);
  });

  it("should handle parsing errors gracefully", async () => {
    (get as any).mockResolvedValue("invalid-json");

    await migrateStorage();

    expect(get).toHaveBeenCalledWith(legacyKey);
    // Should not crash, and should not write/delete
    expect(set).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });
});
