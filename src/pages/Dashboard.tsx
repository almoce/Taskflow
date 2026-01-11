import { Archive, Calendar, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArchivedView } from "@/components/ArchivedView";
import { CalendarView } from "@/components/CalendarView";
import { Dashboard } from "@/components/Dashboard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { ProductivityCharts } from "@/components/ProductivityCharts";
import { ProjectDialog } from "@/components/ProjectDialog";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { TaskSearch } from "@/components/TaskSearch";
import { ProjectSummary } from "@/components/ProjectSummary";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/hooks/useTaskStore";
import type { Priority, Project, ProjectExportData, Task } from "@/types/task";
import { downloadJson } from "@/utils/exportUtils";

type ViewMode = "kanban" | "calendar" | "archived";

const DashboardPage = () => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [analyticsProjectId, setAnalyticsProjectId] = useState<string>("all");

  const {
    projects,
    tasks,
    selectedProject,
    selectedProjectId,
    activeView,
    projectTasks,
    stats,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    setActiveView,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    archiveTask,
    unarchiveTask,
    checkAutoArchive,
    getProjectProgress,
    getProjectTaskCounts,
    archivedTasks,
    importProject,
    getProjectExportData,
  } = useTaskStore();

  useEffect(() => {
    checkAutoArchive();
  }, [checkAutoArchive]);

  const handleSaveProject = (name: string, description?: string, color?: string, icon?: string) => {
    if (editingProject) {
      updateProject(editingProject.id, { name, description, color, icon });
      setEditingProject(null);
    } else {
      addProject(name, description, color, icon);
      setShowNewProject(false);
    }
  };

  const handleAddTask = (
    title: string,
    description?: string,
    priority?: Priority,
    dueDate?: string,
    tag?: Task["tag"],
  ) => {
    if (selectedProjectId) {
      const task = addTask(selectedProjectId, title, priority, tag);
      if (description || dueDate) {
        updateTask(task.id, { description, dueDate });
      }
    }
  };

  const handleExport = (projectId: string) => {
    try {
      const data = getProjectExportData(projectId);
      if (data) {
        downloadJson(data, `TaskFlow-${data.project.name.toLowerCase().replace(/\s+/g, "-")}.json`);
        toast.success("Project exported successfully");
      } else {
        toast.error("Failed to export project");
      }
    } catch (error) {
      console.error("Failed to export project:", error);
      toast.error("Failed to export project");
    }
  };

  const handleImport = (data: ProjectExportData) => {
    try {
      importProject(data);
      toast.success("Project imported successfully");
      setShowNewProject(false);
    } catch (error) {
      console.error("Failed to import project:", error);
      toast.error("Failed to import project");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ProjectSidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        activeView={activeView}
        onSelectProject={selectProject}
        onSetActiveView={setActiveView}
        onEditProject={(project) => setEditingProject(project)}
        onDeleteProject={deleteProject}
        onNewProject={() => setShowNewProject(true)}
        onExport={handleExport}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          {activeView === "analytics" ? (
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
              <ProductivityCharts tasks={tasks} selectedProjectId={analyticsProjectId} />
            </div>
          ) : selectedProject ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.icon && (
                    <span className="text-2xl" role="img" aria-label="Project icon">
                      {selectedProject.icon}
                    </span>
                  )}
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight">{selectedProject.name}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Project Overview & Tasks</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 p-0.5 bg-secondary/50 backdrop-blur-sm rounded-md self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className={`h-7 px-3 text-xs font-medium transition-all ${viewMode === "kanban" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                    Board
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className={`h-7 px-3 text-xs font-medium transition-all ${viewMode === "calendar" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Calendar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("archived")}
                    className={`h-7 px-3 text-xs font-medium transition-all ${viewMode === "archived" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Archive className="h-3.5 w-3.5 mr-1.5" />
                    Archived
                  </Button>
                </div>
              </div>

              <ProjectSummary 
                projectId={selectedProject.id} 
                projectColor={selectedProject.color} 
              />

              <div className="pt-2">
                {viewMode === "kanban" ? (
                <KanbanBoard
                  project={selectedProject}
                  tasks={projectTasks}
                  onAddTask={() => setShowNewTask(true)}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onMoveTask={moveTask}
                  onArchiveTask={archiveTask}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setShowNewTask(true);
                  }}
                />
              ) : viewMode === "calendar" ? (
                <CalendarView
                  project={selectedProject}
                  tasks={projectTasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onAddTask={() => setShowNewTask(true)}
                  onArchiveTask={archiveTask}
                />
              ) : (
                <ArchivedView
                  tasks={archivedTasks.filter((t) => t.projectId === selectedProjectId)}
                  projects={projects}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onUnarchiveTask={unarchiveTask}
                />
              )}
            </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Dashboard stats={stats} onNewProject={() => setShowNewProject(true)} />
              <TaskSearch
                tasks={tasks}
                projects={projects}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onSelectProject={selectProject}
              />
              <ProjectOverview
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={selectProject}
                onEditProject={(project) => setEditingProject(project)}
                onDeleteProject={deleteProject}
                onNewProject={() => setShowNewProject(true)}
                onExport={handleExport}
                getProgress={getProjectProgress}
                getTaskCounts={getProjectTaskCounts}
              />
            </div>
          )}
        </div>
      </main>

      <ProjectDialog
        open={showNewProject || !!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setShowNewProject(false);
            setEditingProject(null);
          }
        }}
        project={editingProject}
        onSubmit={handleSaveProject}
        onImport={!editingProject ? handleImport : undefined}
      />

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
};

export default DashboardPage;
