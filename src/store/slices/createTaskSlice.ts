import type { StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/types/task";
import type { StoreState, TaskSlice } from "../types";

const generateId = () => uuidv4();

export const createTaskSlice: StateCreator<StoreState, [], [], TaskSlice> = (set, get) => ({
  tasks: [],

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
        if (
          updates.status === "done" && 
          t.status !== "done" && 
          !updates.completedAt // Only set if not provided
        ) {
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
    // We can call get().updateTask here, or set directly.
    // Calling get().updateTask is better to reuse the completedAt logic.
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
});
