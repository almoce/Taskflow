import type { Priority, Project, ProjectExportData, Task, TaskStatus } from "@/types/task";

export interface ProjectSlice {
  projects: Project[];
  selectedProjectId: string | null;
  addProject: (name: string, description?: string, color?: string, icon?: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  importProject: (data: ProjectExportData) => void;
  getProjectExportData: (projectId: string) => ProjectExportData | null;
}

export interface TaskSlice {
  tasks: Task[];
  addTask: (projectId: string, title: string, priority?: Priority, tag?: Task["tag"]) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  checkAutoArchive: () => void;
}

export interface UISlice {
  activeView: "tasks" | "analytics";
  setActiveView: (view: "tasks" | "analytics") => void;
}

export interface SettingsSlice {
  // Placeholder for future settings
}

export interface StoreState extends ProjectSlice, TaskSlice, UISlice, SettingsSlice {
  reset: () => void;
}
