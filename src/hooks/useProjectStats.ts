import { useMemo } from "react";
import { taskStore } from "./useTaskStore";

export function useProjectStats(projectId: string | null) {
  const store = taskStore();

  return useMemo(() => {
    if (!projectId) {
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        progress: 0,
      };
    }

    const tasks = store.tasks.filter((t) => t.projectId === projectId && !t.isArchived);
    const total = tasks.length;

    if (total === 0) {
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        progress: 0,
      };
    }

    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const progress = Math.round((done / total) * 100);

    return {
      total,
      todo,
      inProgress,
      done,
      progress,
    };
  }, [store.tasks, projectId]);
}
