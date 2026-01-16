import { useMemo } from "react";
import type { SortCriteria, SortDirection } from "@/store/types";
import type { Task } from "@/types/task";

export const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

export function sortTasks(
  tasks: Task[],
  criteria: SortCriteria | undefined,
  direction: SortDirection = "asc",
): Task[] {
  if (!criteria) return tasks;

  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (criteria) {
      case "priority": {
        const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
        const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
        comparison = weightA - weightB;
        break;
      }
      case "date": {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
        break;
      }
      case "dueDate": {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        comparison = dateA - dateB;
        break;
      }
      case "tag": {
        const tagA = a.tag || "";
        const tagB = b.tag || "";
        comparison = tagA.localeCompare(tagB);
        break;
      }
    }

    return direction === "asc" ? comparison : -comparison;
  });
}

export function useTaskSorter(
  tasks: Task[],
  criteria: SortCriteria | undefined,
  direction: SortDirection = "asc",
) {
  return useMemo(() => {
    return sortTasks(tasks, criteria, direction);
  }, [tasks, criteria, direction]);
}
