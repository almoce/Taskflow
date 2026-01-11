import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type AppState,
  PROJECT_COLORS,
  type Priority,
  type Project,
  type ProjectExportData,
  type Task,
} from "@/types/task";

const generateId = () => uuidv4();

interface TaskStoreState extends AppState {
  // Actions
  addProject: (name: string, description?: string, color?: string, icon?: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  setActiveView: (view: "tasks" | "analytics") => void;
  addTask: (projectId: string, title: string, priority?: Priority, tag?: Task["tag"]) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task["status"]) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  checkAutoArchive: () => void;
  importProject: (data: ProjectExportData) => void;
  getProjectExportData: (projectId: string) => ProjectExportData | null;
  reset: () => void;
}

const defaultState: AppState = {
  projects: [],
  tasks: [],
  selectedProjectId: null,
  activeView: "tasks",
};

const useInternalStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      addProject: (name, description, color, icon) => {
        const { projects } = get();
        const usedColors = projects.map((p) => p.color);
        const defaultAvailableColor =
          PROJECT_COLORS.find((c) => !usedColors.includes(c)) || PROJECT_COLORS[0];

        const project: Project = {
          id: generateId(),
          name,
          description,
          color: color || defaultAvailableColor,
          icon,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [...state.projects, project],
          selectedProjectId: project.id,
        }));
        return project;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
          selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
        }));
      },

      selectProject: (id) => {
        set((state) => ({ selectedProjectId: id, activeView: "tasks" }));
      },

      setActiveView: (view) => {
        set((state) => ({
          activeView: view,
        }));
      },

      addTask: (projectId, title, priority = "medium", tag) => {
        const task: Task = {
          id: generateId(),
          projectId,
          title,
          status: "todo",
          priority,
          tag,
          subtasks: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
        return task;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const updated = { ...t, ...updates };
            if (updates.status === "done" && t.status !== "done") {
              updated.completedAt = new Date().toISOString();
            }
            return updated;
          }),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      moveTask: (taskId, newStatus) => {
        get().updateTask(taskId, { status: newStatus });
      },

      archiveTask: (id) => {
        get().updateTask(id, { isArchived: true });
      },

      unarchiveTask: (id) => {
        get().updateTask(id, { isArchived: false });
      },

      checkAutoArchive: () => {
        const now = new Date();
        const { tasks } = get();
        let hasChanges = false;
        const updatedTasks = tasks.map((t) => {
          if (!t.isArchived && t.status === "done" && t.dueDate && new Date(t.dueDate) < now) {
            hasChanges = true;
            return { ...t, isArchived: true };
          }
          return t;
        });

        if (hasChanges) {
          set({ tasks: updatedTasks });
        }
      },

      importProject: (data) => {
        const { project, tasks } = data;
        const newProjectId = generateId();

        const newProject: Project = {
          ...project,
          id: newProjectId,
          name: `${project.name} (Imported)`, // Append (Imported) to avoid confusion
          createdAt: new Date().toISOString(),
        };

        const newTasks: Task[] = tasks.map((t) => ({
          ...t,
          id: generateId(),
          projectId: newProjectId,
        }));

        set((state) => ({
          projects: [...state.projects, newProject],
          tasks: [...state.tasks, ...newTasks],
          selectedProjectId: newProjectId,
        }));
      },

      getProjectExportData: (projectId) => {
        const { projects, tasks } = get();
        const project = projects.find((p) => p.id === projectId);
        if (!project) return null;

        const projectTasks = tasks.filter((t) => t.projectId === projectId);

        return {
          project,
          tasks: projectTasks,
          version: 1,
        };
      },

      reset: () => {
        set(defaultState);
      },
    }),
    {
      name: "task-manager-data",
    },
  ),
);

export const taskStore = useInternalStore;

export function useTaskStore() {
  const store = useInternalStore();

  // Computed values
  const selectedProject = store.projects.find((p) => p.id === store.selectedProjectId) || null;
  const projectTasks = store.tasks.filter(
    (t) => t.projectId === store.selectedProjectId && !t.isArchived,
  );
  const archivedTasks = store.tasks.filter((t) => t.isArchived);

  const getProjectProgress = (projectId: string) => {
    const tasks = store.tasks.filter((t) => t.projectId === projectId);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === "done").length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getProjectTaskCounts = (projectId: string) => {
    const tasks = store.tasks.filter((t) => t.projectId === projectId);
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  };

  const stats = {
    totalProjects: store.projects.length,
    totalTasks: store.tasks.length,
    completedToday: store.tasks.filter((t) => {
      if (!t.completedAt) return false;
      const today = new Date().toDateString();
      return new Date(t.completedAt).toDateString() === today;
    }).length,
    overdue: store.tasks.filter((t) => {
      if (!t.dueDate || t.status === "done") return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  return {
    ...store,
    selectedProject,
    projectTasks,
    archivedTasks,
    stats,
    getProjectProgress,
    getProjectTaskCounts,
  };
}
