import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import type { Task } from "@/types/task";
import type { StoreState, TaskSlice } from "../types";

const generateId = () => uuidv4();

export const createTaskSlice: StateCreator<StoreState, [], [], TaskSlice> = (set, get) => ({
  tasks: [],
  columnSorts: {},

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
      updatedAt: new Date().toISOString(),
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
        const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
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

  upsertTask: (task) => {
    set((state) => {
      const exists = state.tasks.some((t) => t.id === task.id);
      if (exists) {
        return {
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        };
      }
      return {
        tasks: [...state.tasks, task],
      };
    });
  },

  deleteTask: (id) => {
    // Add to pending deletes for sync propagation
    get().addToPendingDelete("task", id);

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
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const archivedTask: Task = {
      ...task,
      isArchived: true,
      updatedAt: new Date().toISOString(),
    };

    // Mark for deletion from active table on server
    get().addToPendingDelete("task", id);

    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      archivedTasks: [...state.archivedTasks, archivedTask],
    }));
  },

  unarchiveTask: (id) => {
    const task = get().archivedTasks.find((t) => t.id === id);
    if (!task) return;

    const unarchivedTask: Task = {
      ...task,
      isArchived: false,
      updatedAt: new Date().toISOString(),
    };

    // Mark for deletion from archived table on server
    get().addToPendingDelete("archived_task", id);

    set((state) => ({
      archivedTasks: state.archivedTasks.filter((t) => t.id !== id),
      tasks: [...state.tasks, unarchivedTask],
    }));
  },

  checkAutoArchive: () => {
    const now = new Date();
    const { tasks } = get();
    const toArchive: Task[] = [];
    const remainingTasks = tasks.filter((t) => {
      if (!t.isArchived && t.status === "done" && t.dueDate && new Date(t.dueDate) < now) {
        toArchive.push({ ...t, isArchived: true, updatedAt: new Date().toISOString() });
        get().addToPendingDelete("task", t.id);
        return false;
      }
      return true;
    });

    if (toArchive.length > 0) {
      set((state) => ({
        tasks: remainingTasks,
        archivedTasks: [...state.archivedTasks, ...toArchive],
      }));
    }
  },

  setColumnSort: (columnId, sort) => {
    set((state) => {
      const newColumnSorts = { ...state.columnSorts };
      if (sort) {
        newColumnSorts[columnId] = sort;
      } else {
        delete newColumnSorts[columnId];
      }
      return { columnSorts: newColumnSorts };
    });
  },
});
