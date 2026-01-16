import { Archive, Calendar, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArchivedView } from "@/components/ArchivedView";
import { CalendarView } from "@/components/CalendarView";
import { Dashboard } from "@/components/Dashboard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { PricingModal } from "@/components/PricingModal";
import { ProductivityCharts } from "@/components/ProductivityCharts";
import { ProjectDialog } from "@/components/ProjectDialog";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { ProjectSummary } from "@/components/ProjectSummary";
import { TaskSearch } from "@/components/TaskSearch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { useUmami } from "@/hooks/useUmami";
import { supabase } from "@/lib/supabase";
import { useArchivedTasks, useAuth, useProjects, useTasks, useUI } from "@/store/useStore";
import type { Priority, Project, ProjectExportData, Task } from "@/types/task";
import { downloadJson } from "@/utils/exportUtils";

type ViewMode = "kanban" | "calendar" | "archived";

const DashboardPage = () => {
  useRealtimeSync();
  const location = useLocation();
  const navigate = useNavigate();
  const { track } = useUmami();
  // Using the hook properly
  const { fetchProfile: refreshProfile } = useAuth();

  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [analyticsProjectId, setAnalyticsProjectId] = useState<string>("all");

  const {
    projects,
    selectedProjectId,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    importProject,
    getProjectExportData,
  } = useProjects();

  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    archiveTask,
    unarchiveTask,
    checkAutoArchive,
  } = useTasks();

  const { archivedTasks, deleteArchivedTask } = useArchivedTasks();

  const { activeView, setActiveView } = useUI();

  // Handle Stripe Checkout Return
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      toast.promise(refreshProfile(), {
        loading: "Verifying subscription...",
        success: () => {
          // Clean up URL
          navigate("/app", { replace: true });
          return "Welcome to Pro! You now have access to premium features.";
        },
        error: "Failed to verify subscription status. Please refresh.",
      });
    }
  }, [location.search, navigate, refreshProfile]);

  // Computed values (formerly in useTaskStore)
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;
  const projectTasks = tasks.filter((t) => t.projectId === selectedProjectId);
  const archivedTasksForProject = archivedTasks.filter((t) => t.projectId === selectedProjectId);

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter((t) => t.status === "done").length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const getProjectTaskCounts = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    return {
      total: projectTasks.length,
      todo: projectTasks.filter((t) => t.status === "todo").length,
      inProgress: projectTasks.filter((t) => t.status === "in-progress").length,
      done: projectTasks.filter((t) => t.status === "done").length,
    };
  };

  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length + archivedTasks.length,
    completedToday: [...tasks, ...archivedTasks].filter((t) => {
      if (!t.completedAt) return false;
      const today = new Date().toDateString();
      return new Date(t.completedAt).toDateString() === today;
    }).length,
    overdue: tasks.filter((t) => {
      if (!t.dueDate || t.status === "done") return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

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
  
    const handleUnifiedDeleteTask = (id: string) => {
      if (tasks.some((t) => t.id === id)) {
        deleteTask(id);
      } else {
        deleteArchivedTask(id);
      }
    };
  
    const handleUnifiedUpdateTask = (id: string, updates: Partial<Task>) => {
      if (tasks.some((t) => t.id === id)) {
        updateTask(id, updates);
      } else {
        // Archived tasks are currently read-only in this implementation
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
          track("project_export");
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
        track("project_import");
        toast.success("Project imported successfully");
        setShowNewProject(false);
      } catch (error) {
        console.error("Failed to import project:", error);
        toast.error("Failed to import project");
      }
    };
  
    const handleManageSubscription = async () => {
      try {
        const returnUrl = window.location.origin + import.meta.env.BASE_URL + "#/app";
        const { data, error } = await supabase.functions.invoke("create-portal-session", {
          body: { returnUrl },
        });
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (error: any) {
        console.error("Portal error:", error);
        toast.error(error.message || "Failed to open customer portal");
      }
    };
  
    const handleViewModeChange = (mode: ViewMode) => {
      setViewMode(mode);
      track("view_mode_change", { mode });
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
          onUpgrade={() => setShowPricing(true)}
          onManageSubscription={handleManageSubscription}
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
                                  <ProductivityCharts tasks={[...tasks, ...archivedTasks]} selectedProjectId={analyticsProjectId} />
                                </div>
                              ) : selectedProject ? (
                    
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {selectedProject.icon ? (
                      <span className="text-2xl" role="img" aria-label="Project icon">
                        {selectedProject.icon}
                      </span>
                    ) : (
                      <div
                        className="h-8 w-8 rounded-full shrink-0"
                        style={{ backgroundColor: selectedProject.color }}
                      />
                    )}
                    <div className="min-w-0">
                      <h1 className="text-xl font-semibold tracking-tight">{selectedProject.name}</h1>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px] sm:max-w-md">
                        {selectedProject.description || "Project Overview & Tasks"}
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
  
                <ProjectSummary projectId={selectedProject.id} projectColor={selectedProject.color} />
  
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
                      tasks={archivedTasksForProject}
                      projects={projects}
                      onUpdateTask={updateTask}
                      onDeleteTask={deleteArchivedTask}
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
                  archivedTasks={archivedTasks}
                  projects={projects}
                  onUpdateTask={handleUnifiedUpdateTask}
                  onDeleteTask={handleUnifiedDeleteTask}
                  onSelectProject={selectProject}
                />
                <ProjectOverview                projects={projects}
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

      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </div>
  );
};

export default DashboardPage;
