import { get, set } from "idb-keyval";
import { useStore } from "@/store/useStore";
import type { Task } from "@/types/task";

const MIGRATION_FLAG = "taskflow-archived-migration-v1";

export const migrateArchivedTasks = async () => {
  if (typeof window === "undefined") return;

  try {
    const isMigrated = await get(MIGRATION_FLAG);
    if (isMigrated) return;

    const { tasks, upsertArchivedTask, addToPendingDelete } = useStore.getState();
    const toArchive = tasks.filter((t) => t.isArchived);

    if (toArchive.length > 0) {
      console.log(`[Migration] Found ${toArchive.length} archived tasks in active list. Moving...`);

      for (const task of toArchive) {
        // 1. Add to archived slice
        upsertArchivedTask(task);

        // 2. Mark for deletion from active table on server (for Pro users)
        addToPendingDelete("task", task.id);
      }

      // 3. Remove from active tasks slice
      useStore.setState((state) => ({
        tasks: state.tasks.filter((t) => !t.isArchived),
      }));

      console.log("[Migration] Successfully moved archived tasks to separate slice.");
    }

    // Mark migration as complete
    await set(MIGRATION_FLAG, "true");
  } catch (error) {
    console.error("[Migration] Failed to migrate archived tasks:", error);
  }
};
