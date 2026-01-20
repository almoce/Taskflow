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
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Task } from "@/types/task";
import { CompletionSummary } from "./charts/CompletionSummary";
import { CompletionTrendChart } from "./charts/CompletionTrendChart";
import { CompletionBreakdownChart } from "./charts/CompletionBreakdownChart";
import { TaskDistributionChart } from "./charts/TaskDistributionChart";

interface ProductivityChartsProps {
  tasks: Task[];
  projects?: Project[];
  selectedProjectId?: string;
}

export function ProductivityCharts({
  tasks: allTasks,
  projects,
  selectedProjectId = "all",
}: ProductivityChartsProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const tasks = useMemo(() => {
    if (selectedProjectId === "all") return allTasks;
    return allTasks.filter((t) => t.projectId === selectedProjectId);
  }, [allTasks, selectedProjectId]);

  const completionData = useMemo(() => {
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

        const timeSpent = tasks.reduce((acc, task) => {
          const dayKey = format(day, "yyyy-MM-dd");
          return acc + (task.timeSpentPerDay?.[dayKey] || 0);
        }, 0);

        return {
          date: format(day, "EEE"),
          fullDate: format(day, "MMM d"),
          completed,
          created,
          timeSpent,
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

        const timeSpent = tasks.reduce((acc, task) => {
          let weekTotal = 0;
          if (task.timeSpentPerDay) {
            Object.entries(task.timeSpentPerDay).forEach(([dateStr, ms]) => {
              const date = new Date(dateStr);
              if (date >= weekStart && date <= weekEnd) {
                weekTotal += ms;
              }
            });
          }
          return acc + weekTotal;
        }, 0);

        return {
          date: format(weekStart, "MMM d"),
          fullDate: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
          completed,
          created,
          timeSpent,
        };
      });
    }
  }, [tasks, timeRange]);

  const activeTasks = useMemo(() => {
    return tasks.filter((t) => !t.isArchived);
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Productivity Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Create some tasks to see your productivity trends
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CompletionSummary tasks={tasks} />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Productivity Overview</h2>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "week" | "month")}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletionTrendChart data={completionData} />
        <CompletionBreakdownChart data={completionData} timeRange={timeRange} />
        <TaskDistributionChart tasks={activeTasks} projects={projects} />
      </div>
    </div>
  );
}
