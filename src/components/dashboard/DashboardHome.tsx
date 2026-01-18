import { useMemo } from "react";
import { toast } from "sonner";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { TaskSearch } from "@/components/tasks/TaskSearch";
import { useArchivedTasks, useFocus, useProjects, useTasks, useUI } from "@/store/useStore";
import { useUmami } from "@/hooks/useUmami";
import type { Task } from "@/types/task";
import { downloadJson } from "@/utils/exportUtils";

export function DashboardHome() {
  const { track } = useUmami();
  const {
    projects,
    selectProject,
    deleteProject,
    getProjectExportData,
  } = useProjects();
  
  const {
    tasks,
    updateTask,
    deleteTask,
  } = useTasks();

  const { archivedTasks, deleteArchivedTask } = useArchivedTasks();
  const { startFocusSession } = useFocus();
  const { setEditingProject, setIsProjectDialogOpen } = useUI();

  const handleNewProject = () => {
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const stats = useMemo(() => ({
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
  }), [projects.length, tasks, archivedTasks]);

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

  const getProjectProgress = (projectId: string) => {
    const activeProjectTasks = tasks.filter((t) => t.projectId === projectId);
    if (activeProjectTasks.length === 0) return 0;
    const completed = activeProjectTasks.filter((t) => t.status === "done").length;
    return Math.round((completed / activeProjectTasks.length) * 100);
  };

  const getProjectTaskCounts = (projectId: string) => {
    const activeProjectTasks = tasks.filter((t) => t.projectId === projectId);
    return {
      total: activeProjectTasks.length,
      todo: activeProjectTasks.filter((t) => t.status === "todo").length,
      inProgress: activeProjectTasks.filter((t) => t.status === "in-progress").length,
      done: activeProjectTasks.filter((t) => t.status === "done").length,
    };
  };

  return (
    <div className="space-y-8">
      <Dashboard stats={stats} onNewProject={handleNewProject} />
      <TaskSearch
        tasks={tasks}
        archivedTasks={archivedTasks}
        projects={projects}
        onUpdateTask={handleUnifiedUpdateTask}
        onDeleteTask={handleUnifiedDeleteTask}
        onSelectProject={selectProject}
        onStartFocus={(taskId) => startFocusSession(taskId)}
      />
      <ProjectOverview
        projects={projects}
        selectedProjectId={null}
        onSelectProject={selectProject}
        onEditProject={handleEditProject}
        onDeleteProject={deleteProject}
        onNewProject={handleNewProject}
        onExport={handleExport}
        getProgress={getProjectProgress}
        getTaskCounts={getProjectTaskCounts}
      />
    </div>
  );
}
