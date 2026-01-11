import { useMemo } from "react";
import { useStore } from "@/store/useStore";

export function useProjectStats(projectId: string | null) {
  const tasks = useStore((state) => state.tasks);

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

    const projectTasks = tasks.filter((t) => t.projectId === projectId && !t.isArchived);
    const total = projectTasks.length;

    if (total === 0) {
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        progress: 0,
      };
    }

    const todo = projectTasks.filter((t) => t.status === "todo").length;
    const inProgress = projectTasks.filter((t) => t.status === "in-progress").length;
    const done = projectTasks.filter((t) => t.status === "done").length;
    const progress = Math.round((done / total) * 100);

    return {
      total,
      todo,
      inProgress,
      done,
      progress,
    };
  }, [tasks, projectId]);
}
