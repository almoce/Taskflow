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
  const archivedTasks = useStore((state) => state.archivedTasks);

  return useMemo(() => {
    if (!projectId) return [];

    const allTasks = [...tasks, ...archivedTasks];
    const projectTasks = allTasks.filter((t) => t.projectId === projectId);
    const today = startOfDay(new Date());

    if (timeRange === "week") {
      const days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today,
      });

      return days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        
        const completed = projectTasks.filter((task) => {
          if (!task.completedAt) return false;
          const completedDate = startOfDay(new Date(task.completedAt));
          return completedDate.getTime() === day.getTime();
        }).length;

        const created = projectTasks.filter((task) => {
          const createdDate = startOfDay(new Date(task.createdAt));
          return createdDate.getTime() === day.getTime();
        }).length;

        const timeSpentMs = projectTasks.reduce((acc, task) => {
          return acc + (task.timeSpentPerDay?.[dayStr] || 0);
        }, 0);

        return {
          date: format(day, "EEE"),
          fullDate: format(day, "MMM d"),
          completed,
          created,
          timeSpent: Number((timeSpentMs / (1000 * 60 * 60)).toFixed(2)), // to hours
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

        const timeSpentMs = projectTasks.reduce((acc, task) => {
          if (!task.timeSpentPerDay) return acc;
          const weekTotal = Object.entries(task.timeSpentPerDay).reduce((sum, [date, ms]) => {
            const d = new Date(date);
            if (d >= weekStart && d <= weekEnd) return sum + ms;
            return sum;
          }, 0);
          return acc + weekTotal;
        }, 0);

        return {
          date: format(weekStart, "MMM d"),
          fullDate: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
          completed,
          created,
          timeSpent: Number((timeSpentMs / (1000 * 60 * 60)).toFixed(2)),
        };
      });
    }
  }, [tasks, archivedTasks, projectId, timeRange]);
}
