import { Archive, Calendar, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/task";

export type ViewMode = "kanban" | "calendar" | "archived";

interface ProjectHeaderProps {
  project: Project;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddTask?: () => void; // Optional: if we want to move the "Add Task" button here later, but currently it's inside the views.
}

export function ProjectHeader({ project, currentView, onViewChange }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {project.icon ? (
          <span className="text-2xl" role="img" aria-label="Project icon">
            {project.icon}
          </span>
        ) : (
          <div
            className="h-8 w-8 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px] sm:max-w-md">
            {project.description || "Project Overview & Tasks"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-0.5 p-0.5 bg-secondary/50 backdrop-blur-sm rounded-md self-end sm:self-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("kanban")}
          className={`h-7 px-3 text-xs font-medium transition-all ${
            currentView === "kanban"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          Board
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("calendar")}
          className={`h-7 px-3 text-xs font-medium transition-all ${
            currentView === "calendar"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Calendar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("archived")}
          className={`h-7 px-3 text-xs font-medium transition-all ${
            currentView === "archived"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Archive className="h-3.5 w-3.5 mr-1.5" />
          Archived
        </Button>
      </div>
    </div>
  );
}
