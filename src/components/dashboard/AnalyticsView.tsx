import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductivityCharts } from "@/components/analytics/ProductivityCharts";
import { useArchivedTasks, useProjects, useTasks } from "@/store/useStore";

export function AnalyticsView() {
  const [analyticsProjectId, setAnalyticsProjectId] = useState<string>("all");
  const { tasks } = useTasks();
  const { archivedTasks } = useArchivedTasks();
  const { projects } = useProjects();

  const allTasks = [...tasks, ...archivedTasks];

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your productivity</p>
        </div>
        <Select value={analyticsProjectId} onValueChange={setAnalyticsProjectId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ProductivityCharts
        tasks={allTasks}
        projects={projects}
        selectedProjectId={analyticsProjectId}
      />
    </div>
  );
}
