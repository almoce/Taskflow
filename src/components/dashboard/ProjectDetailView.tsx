import { useMemo, useState } from "react";
import { ArchivedView } from "@/components/project-view/archived/ArchivedView";
import { CalendarView } from "@/components/project-view/calendar/CalendarView";
import { KanbanBoard } from "@/components/project-view/kanban/KanbanBoard";
import { ProjectHeader, type ViewMode } from "@/components/project-view/ProjectHeader";
import { ProjectSummary } from "@/components/project-view/ProjectSummary";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";
import { useFocus, useProjects, useTasks } from "@/store/useStore";
import type { Priority, Task } from "@/types/task";
import { useUmami } from "@/hooks/useUmami";



export function ProjectDetailView() {
  const { track } = useUmami();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { projects, selectedProjectId: projectId } = useProjects();
  const {
    addTask,
    updateTask,
  } = useTasks();
  const { startFocusSession } = useFocus();

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);
  

  
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
      <ProjectHeader
        project={project}
        currentView={viewMode}
        onViewChange={handleViewModeChange}
      />

      <ProjectSummary projectId={project.id} projectColor={project.color} />

      <div className="pt-2">
        {viewMode === "kanban" ? (
          <KanbanBoard
            onAddTask={() => setShowNewTask(true)}
            onEditTask={handleEditTask}
          />
        ) : viewMode === "calendar" ? (
          <CalendarView
            onAddTask={() => setShowNewTask(true)}
          />
        ) : (
          <ArchivedView />
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
