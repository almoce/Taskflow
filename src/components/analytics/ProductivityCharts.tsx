import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Project, Task } from "@/types/task";
import { getStartOfMondayWeek, getWeekRangeLabel } from "@/utils/time";
import { CompletionBreakdownChart } from "./charts/CompletionBreakdownChart";
import { CompletionSummary } from "./charts/CompletionSummary";
import { CompletionTrendChart } from "./charts/CompletionTrendChart";
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
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const tasks = useMemo(() => {
    if (selectedProjectId === "all") return allTasks;
    return allTasks.filter((t) => t.projectId === selectedProjectId);
  }, [allTasks, selectedProjectId]);

  const completionData = useMemo(() => {
    const today = startOfDay(new Date());

    if (timeRange === "week") {
      const weekStart = getStartOfMondayWeek(today, weekOffset);
      const days = eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
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

        const projectBreakdown =
          projects
            ?.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const timeSpent = projectTasks.reduce((acc, task) => {
                const dayKey = format(day, "yyyy-MM-dd");
                return acc + (task.timeSpentPerDay?.[dayKey] || 0);
              }, 0);
              return {
                id: project.id,
                name: project.name,
                color: project.color,
                timeSpent,
              };
            })
            .filter((p) => p.timeSpent > 0) || [];

        const timeSpent = projectBreakdown.reduce((acc, p) => acc + p.timeSpent, 0);

        return {
          date: format(day, "EEE"),
          fullDate: format(day, "MMM d"),
          completed,
          created,
          timeSpent,
          projectBreakdown,
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

        const projectBreakdown =
          projects
            ?.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const timeSpent = projectTasks.reduce((acc, task) => {
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
                id: project.id,
                name: project.name,
                color: project.color,
                timeSpent,
              };
            })
            .filter((p) => p.timeSpent > 0) || [];

        const timeSpent = projectBreakdown.reduce((acc, p) => acc + p.timeSpent, 0);

        return {
          date: format(weekStart, "MMM d"),
          fullDate: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
          completed,
          created,
          timeSpent,
          projectBreakdown,
        };
      });
    }
  }, [tasks, timeRange, projects, weekOffset]);

  const activeTasks = useMemo(() => {
    return tasks.filter((t) => !t.isArchived);
  }, [tasks]);

  const weekRangeLabel = useMemo(() => {
    const label = getWeekRangeLabel(new Date(), weekOffset);
    if (weekOffset === 0) return `Current Week: ${label}`;
    if (weekOffset === 1) return `Last Week: ${label}`;
    return `${weekOffset} Weeks Ago: ${label}`;
  }, [weekOffset]);

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold whitespace-nowrap">Productivity Overview</h2>
          {timeRange === "week" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full border border-border/50">
              <span className="text-xs font-medium text-muted-foreground min-w-[180px] text-center">
                {weekRangeLabel}
              </span>
              <div className="flex items-center gap-1 border-l border-border/50 ml-1 pl-1">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => setWeekOffset((prev) => prev + 1)}
                      aria-label="Previous Week"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous Week</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                      disabled={weekOffset === 0}
                      aria-label="Next Week"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Next Week</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>

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
