import { useMemo } from "react";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { taskStore } from "./useTaskStore";

export function useProjectChartData(
  projectId: string | null,
  timeRange: "week" | "month" = "week"
) {
  const store = taskStore();

  return useMemo(() => {
    if (!projectId) return [];

    const tasks = store.tasks.filter((t) => t.projectId === projectId);
    const today = startOfDay(new Date());

    if (timeRange === "week") {
      const days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
      });

      return days.map((day) => {
        const completed = tasks.filter((task) => {
          if (!task.completedAt) return false;
          const completedDate = startOfDay(new Date(task.completedAt));
          return completedDate.getTime() === day.getTime();
        }).length;

        const created = tasks.filter((task) => {
          const createdDate = startOfDay(new Date(task.createdAt));
          return createdDate.getTime() === day.getTime();
        }).length;

        return {
          date: format(day, "EEE"),
          fullDate: format(day, "MMM d"),
          completed,
          created,
        };
      });
    } else {
      const weeks = eachWeekOfInterval({
        start: subMonths(today, 1),
        end: today,
      });

      return weeks.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart);

        const completed = tasks.filter((task) => {
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate >= weekStart && completedDate <= weekEnd;
        }).length;

        const created = tasks.filter((task) => {
          const createdDate = new Date(task.createdAt);
          return createdDate >= weekStart && createdDate <= weekEnd;
        }).length;

        return {
          date: format(weekStart, "MMM d"),
          fullDate: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
          completed,
          created,
        };
      });
    }
  }, [store.tasks, projectId, timeRange]);
}
