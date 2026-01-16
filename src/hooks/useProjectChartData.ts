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
import { useMemo } from "react";
import { useStore } from "@/store/useStore";

export function useProjectChartData(
  projectId: string | null,
  timeRange: "week" | "month" = "week",
) {
  const tasks = useStore((state) => state.tasks);

  return useMemo(() => {
    if (!projectId) return [];

    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const today = startOfDay(new Date());

    if (timeRange === "week") {
      const days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
      });

      return days.map((day) => {
        const completed = projectTasks.filter((task) => {
          if (!task.completedAt) return false;
          const completedDate = startOfDay(new Date(task.completedAt));
          return completedDate.getTime() === day.getTime();
        }).length;

        const created = projectTasks.filter((task) => {
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

        const completed = projectTasks.filter((task) => {
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate >= weekStart && completedDate <= weekEnd;
        }).length;

        const created = projectTasks.filter((task) => {
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
  }, [tasks, projectId, timeRange]);
}
