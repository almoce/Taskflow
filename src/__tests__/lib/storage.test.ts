import * as idb from "idb-keyval";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { indexedDBStorage } from "@/lib/storage";

// Mock idb-keyval
vi.mock("idb-keyval", () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
}));

describe("indexedDBStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getItem should retrieve parsed JSON data from idb-keyval", async () => {
    const mockData = { test: "data" };
    (idb.get as any).mockResolvedValue(JSON.stringify(mockData));

    const result = await indexedDBStorage.getItem("test-storage");

    expect(idb.get).toHaveBeenCalledWith("test-storage");
    // Zustand expects parsed data or null
    // Actually, Zustand's persist middleware expects the storage to return the *string* if using default createJSONStorage?
    // Or if we provide a custom storage object matching StateStorage, getItem returns string | Promise<string | null>.
    // Let's assume we implement StateStorage interface which returns strings/promises of strings.
    // If idb-keyval stores strings, we just return it.

    // Wait, let's verify what we want to store.
    // Usually we store the stringified state.

    expect(result).toBe(JSON.stringify(mockData));
  });

  it("getItem should return null if key does not exist", async () => {
    (idb.get as any).mockResolvedValue(undefined);

    const result = await indexedDBStorage.getItem("non-existent");

    expect(result).toBeNull();
  });

  it("setItem should save stringified data to idb-keyval", async () => {
    const key = "test-storage";
    const value = JSON.stringify({ test: "data" });

    await indexedDBStorage.setItem(key, value);

    expect(idb.set).toHaveBeenCalledWith(key, value);
  });

  it("removeItem should delete key from idb-keyval", async () => {
    const key = "test-storage";

    await indexedDBStorage.removeItem(key);

    expect(idb.del).toHaveBeenCalledWith(key);
  });
});
