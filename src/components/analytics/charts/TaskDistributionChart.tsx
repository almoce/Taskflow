import { Activity } from "lucide-react";
import { useState } from "react";
import { BubbleChart } from "@/components/charts/BubbleChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project, Task } from "@/types/task";

interface TaskDistributionChartProps {
  tasks: Task[];
  projects?: Project[];
}

export function TaskDistributionChart({ tasks, projects }: TaskDistributionChartProps) {
  const [distributionMode, setDistributionMode] = useState<
    "overview" | "status" | "priority" | "tag"
  >("overview");

  return (
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
          <BubbleChart tasks={tasks} projects={projects} groupBy={distributionMode} height={400} />
        </div>
      </CardContent>
    </Card>
  );
}
