import type { Session, User } from "@supabase/supabase-js";
import type { Priority, Project, ProjectExportData, Task, TaskStatus } from "@/types/task";

export type SortCriteria = "priority" | "date" | "dueDate" | "tag";
export type SortDirection = "asc" | "desc";

export interface ColumnSort {
  criteria: SortCriteria;
  direction: SortDirection;
}

export interface ProjectSlice {
  projects: Project[];
  selectedProjectId: string | null;
  addProject: (name: string, description?: string, color?: string, icon?: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  importProject: (data: ProjectExportData) => void;
  upsertProject: (project: Project) => void;
  getProjectExportData: (projectId: string) => ProjectExportData | null;
}

export interface TaskSlice {
  tasks: Task[];
  columnSorts: Record<string, ColumnSort>;
  addTask: (projectId: string, title: string, priority?: Priority, tag?: Task["tag"]) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  upsertTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  checkAutoArchive: () => void;
  setColumnSort: (columnId: string, sort: ColumnSort | null) => void;
}

export interface UISlice {
  activeView: "tasks" | "analytics";
  setActiveView: (view: "tasks" | "analytics") => void;
}

export interface UserProfile {
  id: string;
  is_pro: boolean;
  stripe_customer_id?: string;
}

export interface AuthSlice {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isPro: boolean;
  loading: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export interface SettingsSlice {
  // Placeholder for future settings
}

export interface SyncSlice {
  pendingDeleteProjectIds: string[];
  pendingDeleteTaskIds: string[];
  addToPendingDelete: (type: "project" | "task", id: string) => void;
  removeFromPendingDelete: (type: "project" | "task", id: string) => void;
}

export interface StoreState extends ProjectSlice, TaskSlice, UISlice, AuthSlice, SettingsSlice, SyncSlice {
  reset: () => void;
}
