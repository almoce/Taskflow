import { Archive, Calendar, LayoutGrid } from "lucide-react";
import { useMemo, useState } from "react";
import { ArchivedView } from "@/components/project-view/archived/ArchivedView";
import { CalendarView } from "@/components/project-view/calendar/CalendarView";
import { KanbanBoard } from "@/components/project-view/kanban/KanbanBoard";
import { ProjectSummary } from "@/components/project-view/ProjectSummary";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";
import { Button } from "@/components/ui/button";
import { useArchivedTasks, useFocus, useProjects, useTasks } from "@/store/useStore";
import type { Priority, Task } from "@/types/task";
import { useUmami } from "@/hooks/useUmami";

type ViewMode = "kanban" | "calendar" | "archived";

export function ProjectDetailView() {
  const { track } = useUmami();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { projects, selectedProjectId: projectId } = useProjects();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    archiveTask,
    unarchiveTask,
  } = useTasks();
  const { archivedTasks, deleteArchivedTask } = useArchivedTasks();
  const { startFocusSession } = useFocus();

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);
  
  const projectTasks = useMemo(
    () => (projectId ? tasks.filter((t) => t.projectId === projectId) : []),
    [tasks, projectId]
  );

  const archivedTasksForProject = useMemo(
    () => (projectId ? archivedTasks.filter((t) => t.projectId === projectId) : []),
    [archivedTasks, projectId]
  );
  
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    track("view_mode_change", { mode });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowNewTask(true);
  };
  
  const handleAddTask = (
    title: string,
    description?: string,
    priority?: Priority,
    dueDate?: string,
    tag?: Task["tag"],
    startFocus?: boolean,
  ) => {
    if (projectId) {
      const task = addTask(projectId, title, priority, tag);
      if (description || dueDate) {
        updateTask(task.id, { description, dueDate });
      }
      if (startFocus) {
        startFocusSession(task.id);
      }
    }
  };

  if (!project || !projectId) return null;

  return (
    <div className="space-y-6">
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
            onClick={() => handleViewModeChange("kanban")}
            className={`h-7 px-3 text-xs font-medium transition-all ${viewMode === "kanban" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Board
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewModeChange("calendar")}
            className={`h-7 px-3 text-xs font-medium transition-all ${viewMode === "calendar" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Calendar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewModeChange("archived")}
            className={`h-7 px-3 text-xs font-medium transition-all ${viewMode === "archived" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Archive className="h-3.5 w-3.5 mr-1.5" />
            Archived
          </Button>
        </div>
      </div>

      <ProjectSummary projectId={project.id} projectColor={project.color} />

      <div className="pt-2">
        {viewMode === "kanban" ? (
          <KanbanBoard
            project={project}
            tasks={projectTasks}
            onAddTask={() => setShowNewTask(true)}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            onArchiveTask={archiveTask}
            onEditTask={handleEditTask}
            onStartFocus={startFocusSession}
          />
        ) : viewMode === "calendar" ? (
          <CalendarView
            project={project}
            tasks={projectTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddTask={() => setShowNewTask(true)}
            onArchiveTask={archiveTask}
            onStartFocus={startFocusSession}
          />
        ) : (
          <ArchivedView
            tasks={archivedTasksForProject}
            projects={projects}
            onUpdateTask={updateTask}
            onDeleteTask={deleteArchivedTask}
            onUnarchiveTask={unarchiveTask}
          />
        )}
      </div>

      <NewTaskDialog
        open={showNewTask}
        onOpenChange={(open) => {
            setShowNewTask(open);
            if (!open) setEditingTask(null);
        }}
        onSubmit={handleAddTask}
        editTask={editingTask}
        onEditSubmit={updateTask}
      />
    </div>
  );
}
