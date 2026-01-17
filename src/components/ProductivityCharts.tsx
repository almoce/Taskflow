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
import { Activity, AlertCircle, BarChart3, Tag, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { BubbleChart } from "@/components/charts/BubbleChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useTaskStore } from "@/hooks/useTaskStore";
import type { Project, Task } from "@/types/task";

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
  const [distributionMode, setDistributionMode] = useState<
    "overview" | "status" | "priority" | "tag"
  >("overview");

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
  }, [tasks, timeRange]);

  const totalCompleted = tasks.filter((t) => t.status === "done").length;
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

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
      {/* Completion Rate Summary */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Completion Rate</p>
              <p className="text-3xl font-bold">{completionRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-emerald-500">{totalCompleted}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
        {/* Completion Trend Area Chart */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Task Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={completionData} height={200} />
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Created</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily/Weekly Breakdown Bar Chart */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              {timeRange === "week" ? "Daily" : "Weekly"} Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={completionData} height={200} />
          </CardContent>
        </Card>

        {/* Unified Task Analysis Bubble Chart */}
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Task Distribution Analysis
              </CardTitle>
              <CardDescription>Visualize tasks by different dimensions</CardDescription>
            </div>
            <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
              {(["overview", "status", "priority", "tag"] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setDistributionMode(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    distributionMode === mode
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <BubbleChart
                tasks={tasks}
                projects={projects}
                groupBy={distributionMode}
                height={400}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
