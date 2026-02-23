export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskTag = "Bug" | "Feature" | "Improvement";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tag?: TaskTag;
  dueDate?: string;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  isArchived?: boolean;
  totalTimeSpent?: number; // in milliseconds
  timeSpentPerDay?: Record<string, number>; // date string (ISO) -> milliseconds
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt?: string;
}

export const PROJECT_COLORS = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#84CC16", // Lime
];

export interface ProjectExportData {
  project: Project;
  tasks: Task[];
  version: number;
}
