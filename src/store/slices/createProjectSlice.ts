import { v4 as uuidv4 } from "uuid";
import type { StateCreator } from "zustand";
import { PROJECT_COLORS, type Project } from "@/types/task";
import type { ProjectSlice, StoreState } from "../types";

const generateId = () => uuidv4();

export const createProjectSlice: StateCreator<StoreState, [], [], ProjectSlice> = (set, get) => ({
  projects: [],
  selectedProjectId: null,

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
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      projects: [...state.projects, project],
      selectedProjectId: project.id,
    }));
    return project;
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
      ),
    }));
  },

  deleteProject: (id) => {
    // Add to pending deletes for sync propagation
    get().addToPendingDelete("project", id);

    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      // Cross-slice state update: removing tasks associated with the project
      tasks: state.tasks.filter((t) => t.projectId !== id),
      archivedTasks: state.archivedTasks.filter((t) => t.projectId !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
    }));
  },

  selectProject: (id) => {
    // Cross-slice state update: resetting active view to 'tasks'
    set((state) => ({ selectedProjectId: id, activeView: "tasks" }));
  },

  importProject: (data) => {
    const { project, tasks } = data;
    const newProjectId = generateId();

    const newProject: Project = {
      ...project,
      id: newProjectId,
      name: `${project.name} (Imported)`,
      createdAt: new Date().toISOString(),
    };

    const allNewTasks = tasks.map((t) => ({
      ...t,
      id: generateId(),
      projectId: newProjectId,
    }));

    const newActiveTasks = allNewTasks.filter((t) => !t.isArchived);
    const newArchivedTasks = allNewTasks.filter((t) => t.isArchived);

    set((state) => ({
      projects: [...state.projects, newProject],
      // Cross-slice state update
      tasks: [...state.tasks, ...newActiveTasks],
      archivedTasks: [...state.archivedTasks, ...newArchivedTasks],
      selectedProjectId: newProjectId,
    }));
  },

  upsertProject: (project) => {
    set((state) => {
      const exists = state.projects.some((p) => p.id === project.id);
      if (exists) {
        return {
          projects: state.projects.map((p) => (p.id === project.id ? project : p)),
        };
      }
      return {
        projects: [...state.projects, project],
      };
    });
  },

  getProjectExportData: (projectId) => {
    const { projects, tasks, archivedTasks } = get();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const projectActiveTasks = tasks.filter((t) => t.projectId === projectId);
    const projectArchivedTasks = archivedTasks.filter((t) => t.projectId === projectId);

    return {
      project,
      tasks: [...projectActiveTasks, ...projectArchivedTasks],
      version: 1,
    };
  },
});
