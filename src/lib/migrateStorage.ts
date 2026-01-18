import { get, set } from "idb-keyval";

export const migrateStorage = async (storeName: string) => {
  const MIGRATION_KEY = "taskflow-migration-v1";

  try {
    // Check if already migrated
    const isMigrated = await get(MIGRATION_KEY);
    if (isMigrated) return;

    // Check if LocalStorage has data
    const lsData = localStorage.getItem(storeName);
    if (!lsData) return;

    // Migrate to IndexedDB
    await set(storeName, lsData);

    // Mark as migrated
    await set(MIGRATION_KEY, "true");

    console.log(`[Migration] Successfully migrated ${storeName} to IndexedDB`);

    // Optional: Clear LocalStorage after verification?
    // For safety, we can leave it for now, or clear it.
    // Given the strictness of the framework, simpler is better.
    // Just copying is safe.
  } catch (error) {
    console.error("[Migration] Failed to migrate storage:", error);
  }
};
