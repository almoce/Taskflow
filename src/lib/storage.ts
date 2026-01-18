import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

// Custom storage adapter for Zustand using IndexedDB
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    return value || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
