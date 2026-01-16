import "@testing-library/jest-dom";
import { vi } from "vitest";

// Global mock for idb-keyval to support IndexedDB in tests
vi.mock("idb-keyval", () => {
  const store = new Map();
  return {
    get: vi.fn((key) => Promise.resolve(store.get(key))),
    set: vi.fn((key, val) => Promise.resolve(store.set(key, val))),
    del: vi.fn((key) => Promise.resolve(store.delete(key))),
    clear: vi.fn(() => Promise.resolve(store.clear())),
    keys: vi.fn(() => Promise.resolve(Array.from(store.keys()))),
  };
});
